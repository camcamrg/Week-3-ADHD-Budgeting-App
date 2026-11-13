// proxy.ts — keeps the Supabase session fresh on every request.
// (In Next.js 16 this file used to be called "middleware".)
// It reads your session cookie, renews it if it's expiring, and writes it back
// so your sign-in sticks between visits.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Asking "who is the user?" is what triggers the session to refresh.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  // Run on every page except Next.js's internal static files and the icon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};