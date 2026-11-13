"use server";

// Server actions for The List — the ONLY place the items table is touched.
// Each action runs on the server, re-checks the signed-in user (never trusting
// the browser), then does its one job. RLS is the second lock behind all of this.

import { createSupabaseServerClient } from "@/lib/supabaseServer";

type ItemType = "bill" | "task";

type Item = {
  id: string;
  type: ItemType;
  title: string;
  amount: number | null;
  due_date: string | null;
  is_done: boolean;
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
}): Promise<void> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("items").insert({
    user_id: user.id,
    type: input.type,
    title: input.title,
    amount: input.amount,
    due_date: input.due_date,
  });
  if (error) throw new Error(error.message);
}

// MARK DONE / UNDONE.
export async function toggleItem(id: string, isDone: boolean): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("items")
    .update({ is_done: isDone })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// DELETE.
export async function deleteItem(id: string): Promise<void> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}