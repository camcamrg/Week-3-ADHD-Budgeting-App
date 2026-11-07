// Momentum — the browser Supabase client ("the phone line to the database").
// Reads the public URL + publishable key from .env (NEXT_PUBLIC_* = safe for the browser).
// Row-Level Security is what protects the data, not the secrecy of this key.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // A clear, friendly error beats a cryptic one if the .env values are missing.
  throw new Error(
    "Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
