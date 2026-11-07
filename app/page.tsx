"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  // null = still checking, true/false = known sign-in state.
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
      {/* Light/dark toggle, top-right. */}
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
          <Chip
            label="ADHD-friendly budgeting"
            color="tertiary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />

          <Typography component="h1" variant="h1" color="text.primary">
            Momentum
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 440 }}
          >
            A calm place to stay on top of your money and your time. See
            what&apos;s safe to spend, and what&apos;s coming up next — without
            the overwhelm.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 1, width: "100%", justifyContent: "center" }}
          >
            {signedIn ? (
              // Already signed in — don't ask again; just let them back in.
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                href="/account"
              >
                Continue
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  href="/login"
                >
                  Get started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={Link}
                  href="/login"
                >
                  I already have an account
                </Button>
              </>
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
            Your data stays private — only you can see it.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
