"use client";

// The List (Epic 2): the unified money + time list.
// UI runs in the browser; all DATABASE work now goes through server actions
// (app/actions/items.ts). Auth session checks still use the browser client,
// since those just read the sign-in cookie — not the database tables.

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
import { getItems, addItem, toggleItem, deleteItem } from "@/app/actions/items";
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

  // READ via the server action.
  const loadItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your list.");
    }
    setLoadingItems(false);
  }, []);

  // Require sign-in, then load the list.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setChecking(false);
      loadItems();
    });
  }, [router, loadItems]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (title.trim().length === 0) return;
    setSaving(true);
    setError("");
    try {
      await addItem({
        type,
        title: title.trim(),
        amount: type === "bill" && amount !== "" ? Number(amount) : null,
        due_date: dueDate || null,
      });
      setTitle("");
      setAmount("");
      setDueDate("");
      await loadItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that item.");
    }
    setSaving(false);
  }

  async function toggleDone(item: Item) {
    await toggleItem(item.id, !item.is_done);
    await loadItems();
  }

  async function removeItem(item: Item) {
    await deleteItem(item.id);
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