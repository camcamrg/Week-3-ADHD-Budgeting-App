"use client";

// Home (Epic 3): the daily glance — Safe-to-Spend + the single next thing.
// Safe-to-Spend = current balance − unpaid bills. Data now comes from server
// actions (getProfile, getItems); auth stays in the browser (cookie only).

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
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import { getItems } from "@/app/actions/items";
import { getProfile, saveMoney } from "@/app/actions/profile";
import ThemeToggle from "../ThemeToggle";

type Item = {
  id: string;
  type: "bill" | "task";
  title: string;
  amount: number | null;
  due_date: string | null;
  is_done: boolean;
};

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<Item[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [income, setIncome] = useState<number | null>(null);

  // "Set your money" form
  const [editing, setEditing] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");
  const [incomeInput, setIncomeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prof, itemData] = await Promise.all([getProfile(), getItems()]);
      setBalance(prof?.current_balance ?? null);
      setIncome(prof?.monthly_income ?? null);
      setItems(itemData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setChecking(false);
      loadData();
    });
  }, [router, loadData]);

  // --- The calculations ---
  const unpaidBillsTotal = items
    .filter((i) => i.type === "bill" && !i.is_done)
    .reduce((sum, i) => sum + (i.amount ?? 0), 0);

  const hasBalance = balance != null;
  const safeToSpend = (balance ?? 0) - unpaidBillsTotal;

  // Next thing = soonest-due unpaid item (items with no date sort last).
  const nextThing = [...items]
    .filter((i) => !i.is_done)
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    })[0];

  function startEdit() {
    setBalanceInput(balance != null ? String(balance) : "");
    setIncomeInput(income != null ? String(income) : "");
    setError("");
    setEditing(true);
  }

  async function handleSaveMoney(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveMoney({
        balance: balanceInput !== "" ? Number(balanceInput) : null,
        income: incomeInput !== "" ? Number(incomeInput) : null,
      });
      setEditing(false);
      await loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your money.");
    }
    setSaving(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  const money = (n: number) =>
    `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
            <Typography component="h1" variant="h1" sx={{ fontSize: "1.75rem" }}>
              Momentum
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <ThemeToggle />
              <Button size="small" variant="text" color="primary" onClick={signOut}>
                Sign out
              </Button>
            </Stack>
          </Stack>

          {/* Safe-to-Spend */}
          <Card variant="outlined" sx={{ borderRadius: 4 }}>
            <CardContent sx={{ textAlign: "center", py: 4 }}>
              {!hasBalance ? (
                <Stack spacing={2} sx={{ alignItems: "center" }}>
                  <Typography color="text.secondary">
                    Add your current balance to see what&apos;s safe to spend.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={startEdit}>
                    Set up my money
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="overline" color="text.secondary">
                    Safe to spend
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: safeToSpend >= 0 ? "primary.main" : "tertiary.main",
                    }}
                  >
                    {money(safeToSpend)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {money(balance ?? 0)} balance − {money(unpaidBillsTotal)} in upcoming bills
                  </Typography>
                  {safeToSpend < 0 && (
                    <Typography variant="body2" sx={{ color: "tertiary.main", mt: 1 }}>
                      Your bills are more than your balance right now — go gently. 💛
                    </Typography>
                  )}
                  <Button size="small" variant="text" onClick={startEdit} sx={{ mt: 1 }}>
                    Update balance
                  </Button>
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* Set-money form */}
          {editing && (
            <Card variant="outlined">
              <CardContent>
                <Box component="form" onSubmit={handleSaveMoney}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle1">Your money</Typography>
                    <TextField
                      label="Current balance"
                      type="number"
                      value={balanceInput}
                      onChange={(e) => setBalanceInput(e.target.value)}
                      fullWidth
                      autoFocus
                      slotProps={{ input: { startAdornment: <Box sx={{ mr: 0.5 }}>$</Box> } }}
                    />
                    <TextField
                      label="Monthly income (optional)"
                      type="number"
                      value={incomeInput}
                      onChange={(e) => setIncomeInput(e.target.value)}
                      fullWidth
                      slotProps={{ input: { startAdornment: <Box sx={{ mr: 0.5 }}>$</Box> } }}
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    <Stack direction="row" spacing={1}>
                      <Button type="submit" variant="contained" color="primary" disabled={saving}>
                        {saving ? "Saving…" : "Save"}
                      </Button>
                      <Button variant="text" onClick={() => setEditing(false)} disabled={saving}>
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Your next thing */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Your next thing
              </Typography>
              {loading ? (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Loading…
                </Typography>
              ) : nextThing ? (
                <Stack spacing={1} sx={{ mt: 0.5 }}>
                  <Typography variant="h6">{nextThing.title}</Typography>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      label={nextThing.type === "bill" ? "Bill" : "Task"}
                      color={nextThing.type === "bill" ? "tertiary" : "secondary"}
                      variant="outlined"
                    />
                    {nextThing.amount != null && (
                      <Typography variant="body2" color="text.secondary">
                        {money(nextThing.amount)}
                      </Typography>
                    )}
                    {nextThing.due_date && (
                      <Typography variant="body2" color="text.secondary">
                        due {nextThing.due_date}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Typography sx={{ mt: 1 }}>You&apos;re all caught up. 🎉</Typography>
              )}
            </CardContent>
          </Card>

          <Button component={Link} href="/list" variant="contained" color="primary" size="large">
            Open your full list
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}