"use server";

// Server actions for the user's money + reminder profile.
// Same rules as the items actions: runs on the server, re-checks the user,
// then does one database job. RLS is the second lock.

import { createSupabaseServerClient } from "@/lib/supabaseServer";

type Profile = {
  current_balance: number | null;
  monthly_income: number | null;
  reminder_lead_days: number | null;
};

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

// READ the user's profile (null if they haven't set it up yet).
export async function getProfile(): Promise<Profile | null> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("current_balance, monthly_income, reminder_lead_days")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as Profile | null;
}

// SAVE (create or update) the user's balance, income, and reminder window.
export async function saveMoney(input: {
  balance: number | null;
  income: number | null;
  leadDays?: number | null;
}): Promise<void> {
  const { supabase, user } = await requireUser();

  const row: Record<string, unknown> = {
    id: user.id,
    current_balance: input.balance,
    monthly_income: input.income,
  };

  // Only touch reminder_lead_days when a value was actually passed, so
  // updating just the balance never wipes the reminder setting.
  if (input.leadDays != null) {
    row.reminder_lead_days = input.leadDays;
  }

  const { error } = await supabase.from("profiles").upsert(row);
  if (error) throw new Error(error.message);
}