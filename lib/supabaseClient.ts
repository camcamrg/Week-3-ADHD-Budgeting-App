// Momentum — the BROWSER Supabase client.
// Used for auth only (sign in / out, checking the session). Now cookie-based
// (via @supabase/ssr) so the SERVER can see the same sign-in.

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file (see .env.example)."
  );
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);