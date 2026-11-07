"use client";

// Where the magic link lands. The Supabase client automatically reads the
// session from the URL on load, so here we just show who's signed in.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "../ThemeToggle";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read whatever session we have right now…
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    });

    // …and keep updating if sign-in completes from the magic link or we sign out.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setEmail(null);
  }

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
          {loading ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <CircularProgress size={20} />
              <Typography>Checking your sign-in…</Typography>
            </Stack>
          ) : email ? (
            <>
              <Chip color="primary" label="Signed in ✓" />
              <Typography component="h1" variant="h1" sx={{ fontSize: "2rem" }}>
                You&apos;re in 🎉
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Signed in as <strong>{email}</strong>
              </Typography>
              <Button variant="outlined" color="primary" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Typography component="h1" variant="h1" sx={{ fontSize: "2rem" }}>
                Not signed in
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You don&apos;t have an active session yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/login"
              >
                Go to sign in
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
