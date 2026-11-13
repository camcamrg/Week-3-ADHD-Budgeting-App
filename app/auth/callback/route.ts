// app/auth/callback/route.ts
// The magic link lands here. It trades the one-time code in the link for a real
// session (saved as a secure cookie), then sends the user to their Home screen.

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  // No code, or it didn't work — send them back to sign in.
  return NextResponse.redirect(`${origin}/login?error=auth`);
}