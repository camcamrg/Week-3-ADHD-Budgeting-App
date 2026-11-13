"use server";

// Server actions for The List — the ONLY place the items table is touched.
// Each action runs on the server, re-checks the signed-in user (never trusting
// the browser), then does its one job. RLS is the second lock behind all of this.

import { createSupabaseServerClient } from "@/lib/supabaseServer";

type ItemType = "bill" | "task";
type RecurEvery = "day" | "week" | "month" | "year";

type Item = {
  id: string;
  type: ItemType;
  title: string;
  amount: number | null;
  due_date: string | null;
  is_done: boolean;
  is_recurring: boolean;
  recurs_every: RecurEvery | null;
};

// Shared helper: get the server client AND confirm someone is signed in.
async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

// Move a date forward by one cycle, returned as "YYYY-MM-DD".
// If there's no date yet, we count from today.
function addInterval(dateStr: string | null, every: RecurEvery): string {
  const d = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
  if (every === "day") d.setDate(d.getDate() + 1);
  else if (every === "week") d.setDate(d.getDate() + 7);
  else if (every === "month") d.setMonth(d.getMonth() + 1);
  else if (every === "year") d.setFullYear(d.getFullYear() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// READ — everything on this user's list, soonest due first.
export async function getItems(): Promise<Item[]> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Item[];
}

// ADD — insert a new bill or task, stamped with this user's id.
export async function addItem(input: {
  type: ItemType;
  title: string;
  amount: number | null;
  due_date: string | null;
  is_recurring: boolean;
  recurs_every: RecurEvery | null;
}): Promise<void> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("items").insert({
    user_id: user.id,
    type: input.type,
    title: input.title,
    amount: input.amount,
    due_date: input.due_date,
    is_recurring: input.is_recurring,
    recurs_every: input.is_recurring ? input.recurs_every : null,
  });
  if (error) throw new Error(error.message);
}

// MARK DONE / UNDONE.
// Special case: checking off a RECURRING item rolls it forward to the next
// cycle and keeps it not-done, instead of leaving a finished row behind.
export async function toggleItem(id: string, isDone: boolean): Promise<void> {
  const { supabase } = await requireUser();

  // Un-checking is always simple.
  if (!isDone) {
    const { error } = await supabase.from("items").update({ is_done: false }).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  // Checking done: look up the row to see if it repeats.
  const { data: row, error: readErr } = await supabase
    .from("items")
    .select("is_recurring, recurs_every, due_date")
    .eq("id", id)
    .single();
  if (readErr) throw new Error(readErr.message);

  if (row?.is_recurring && row.recurs_every) {
    // Roll forward: jump to the next due date, stay not-done.
    const next = addInterval(row.due_date, row.recurs_every as RecurEvery);
    const { error } = await supabase
      .from("items")
      .update({ due_date: next, is_done: false })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    // One-off item: just mark it done.
    const { error } = await supabase.from("items").update({ is_done: true }).eq("id", id);
    if (error) throw new Error(error.message);
  }
}

// DELETE.
export async function deleteItem(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}