"use client";

// Passwordless sign-in: the user enters their email and gets a magic link.
// No password is ever created or stored (per the Momentum spec).

import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

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
            Welcome
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
