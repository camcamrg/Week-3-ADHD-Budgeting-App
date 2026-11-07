"use client";

// Passwordless sign-in: the user enters their email and gets a magic link.
// No password is ever created or stored (per the Momentum spec).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import ThemeToggle from "../ThemeToggle";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [remembered, setRemembered] = useState(false);

  // If already signed in, skip the magic-link step entirely.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/list");
    });
  }, [router]);

  // Pre-fill the email we remembered from a previous sign-in (convenience only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("momentum:lastEmail");
      if (saved) {
        setEmail(saved);
        setRemembered(true);
      }
    } catch {
      // localStorage can be blocked (private mode) — just skip the convenience.
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    // Remember the email as soon as they try — even if the send fails
    // (e.g. rate limit), so we never lose what they typed.
    try {
      localStorage.setItem("momentum:lastEmail", email);
    } catch {
      // ignore if storage is unavailable
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Where the magic link sends the user back to once they click it.
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
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

      <Container maxWidth="xs">
        <Stack spacing={3} sx={{ textAlign: "center" }}>
          <Typography component="h1" variant="h1" sx={{ fontSize: "2.5rem" }}>
            {remembered ? "Welcome back" : "Welcome"}
          </Typography>

          {status === "sent" ? (
            <Alert severity="success" sx={{ textAlign: "left" }}>
              Check your email — we sent a sign-in link to <strong>{email}</strong>.
              Click it to finish signing in. You can close this tab.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary">
                Enter your email and we&apos;ll send you a one-time sign-in link.
                No password needed.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoComplete="email"
                    autoFocus
                  />

                  {status === "error" && (
                    <Alert severity="error" sx={{ textAlign: "left" }}>
                      {errorMsg}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={status === "sending" || email.length === 0}
                  >
                    {status === "sending" ? "Sending…" : "Send me a link"}
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
