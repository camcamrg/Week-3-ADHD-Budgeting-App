"use client";

// The List (Epic 2): the unified money + time list.
// A signed-in user can add bills/tasks, see them by due date, mark them done, and remove them.
// RLS guarantees each query only ever touches this user's own rows.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "../ThemeToggle";

type ItemType = "bill" | "task";

type Item = {
  id: string;
  type: ItemType;
  title: string;
  amount: number | null;
  due_date: string | null;
  is_done: boolean;
};

export default function ListPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Add-item form fields
  const [type, setType] = useState<ItemType>("bill");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadItems = useCallback(async () => {
    setLoadingItems(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("due_date", { ascending: true, nullsFirst: false });
    if (error) setError(error.message);
    else setItems((data ?? []) as Item[]);
    setLoadingItems(false);
  }, []);

  // Require sign-in, then load the list.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      if (!uid) {
        router.replace("/login");
        return;
      }
      setUserId(uid);
      setChecking(false);
      loadItems();
    });
  }, [router, loadItems]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!userId || title.trim().length === 0) return;
    setSaving(true);
    setError("");

    const { error } = await supabase.from("items").insert({
      user_id: userId, // must match auth.uid() — RLS enforces it
      type,
      title: title.trim(),
      amount: type === "bill" && amount !== "" ? Number(amount) : null,
      due_date: dueDate || null,
    });

    if (error) {
      setError(error.message);
    } else {
      setTitle("");
      setAmount("");
      setDueDate("");
      await loadItems();
    }
    setSaving(false);
  }

  async function toggleDone(item: Item) {
    await supabase.from("items").update({ is_done: !item.is_done }).eq("id", item.id);
    await loadItems();
  }

  async function removeItem(item: Item) {
    await supabase.from("items").delete().eq("id", item.id);
    await loadItems();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (checking) {
    return (
      <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ minHeight: "100dvh", bgcolor: "background.default", py: 5, px: 2 }}>
      <Container maxWidth="sm">
        <Stack spacing={3}>
          {/* Header */}
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography component="h1" variant="h1" sx={{ fontSize: "2rem" }}>
              Your List
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ThemeToggle />
              <Button size="small" variant="text" color="primary" onClick={handleSignOut}>
                Sign out
              </Button>
            </Stack>
          </Stack>

          {/* Add-item form */}
          <Card variant="outlined">
            <CardContent>
              <Box component="form" onSubmit={handleAdd}>
                <Stack spacing={2}>
                  <ToggleButtonGroup
                    exclusive
                    value={type}
                    onChange={(_e, next) => next && setType(next)}
                    color="primary"
                    size="small"
                    aria-label="Item type"
                  >
                    <ToggleButton value="bill">💸 Bill</ToggleButton>
                    <ToggleButton value="task">✅ Task</ToggleButton>
                  </ToggleButtonGroup>

                  <TextField
                    label={type === "bill" ? "What's the bill?" : "What's the task?"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                    autoComplete="off"
                  />

                  {type === "bill" && (
                    <TextField
                      label="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      fullWidth
                      slotProps={{ input: { startAdornment: <Box sx={{ mr: 0.5 }}>$</Box> } }}
                    />
                  )}

                  <TextField
                    label="Due date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  {error && <Alert severity="error">{error}</Alert>}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving || title.trim().length === 0}
                  >
                    {saving ? "Adding…" : "Add to my list"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {/* The list */}
          {loadingItems ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", py: 2 }}>
              <CircularProgress size={20} />
              <Typography>Loading your list…</Typography>
            </Stack>
          ) : items.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
              Nothing here yet. Add your first bill or task above. 🌱
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {items.map((item) => (
                <Card key={item.id} variant="outlined">
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 1, "&:last-child": { pb: 2 } }}>
                    <Checkbox
                      checked={item.is_done}
                      onChange={() => toggleDone(item)}
                      aria-label={`Mark ${item.title} done`}
                    />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          textDecoration: item.is_done ? "line-through" : "none",
                          color: item.is_done ? "text.secondary" : "text.primary",
                          fontWeight: 500,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5, flexWrap: "wrap" }}>
                        <Chip
                          size="small"
                          label={item.type === "bill" ? "Bill" : "Task"}
                          color={item.type === "bill" ? "tertiary" : "secondary"}
                          variant="outlined"
                        />
                        {item.amount != null && (
                          <Typography variant="body2" color="text.secondary">
                            ${item.amount.toFixed(2)}
                          </Typography>
                        )}
                        {item.due_date && (
                          <Typography variant="body2" color="text.secondary">
                            due {item.due_date}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    <Button size="small" variant="text" color="secondary" onClick={() => removeItem(item)}>
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <Button component={Link} href="/home" variant="text" size="small" sx={{ alignSelf: "center" }}>
            ← Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
