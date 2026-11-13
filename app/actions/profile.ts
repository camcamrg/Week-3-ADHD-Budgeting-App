"use server";

// Server actions for the user's money profile (balance + monthly income).
// Same rules as the items actions: runs on the server, re-checks the user,
// then does one database job. RLS is the second lock.

import { createSupabaseServerClient } from "@/lib/supabaseServer";

type Profile = {
  current_balance: number | null;
  monthly_income: number | null;
};

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

// READ the user's money profile (null if they haven't set it up yet).
export async function getProfile(): Promise<Profile | null> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("profiles")
    .select("current_balance, monthly_income")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as Profile | null;
}

// SAVE (create or update) the user's balance + income.
export async function saveMoney(input: {
  balance: number | null;
  income: number | null;
}): Promise<void> {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    current_balance: input.balance,
    monthly_income: input.income,
  });
  if (error) throw new Error(error.message);
}