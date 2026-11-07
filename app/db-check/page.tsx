"use client";

// Temporary connection test. Visit /db-check to confirm the app can reach Supabase.
// Safe to delete once we've verified the connection.

import { useEffect, useState } from "react";
import { Box, Typography, Chip, CircularProgress, Stack } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

type Status = "loading" | "ok" | "error";

export default function DbCheckPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    // Ask for our items. Before sign-in, RLS correctly returns an EMPTY list
    // (no error) — which proves both the connection AND that RLS is active.
    supabase
      .from("items")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          setStatus("error");
          setDetail(error.message);
        } else {
          setStatus("ok");
          setDetail(
            `Query succeeded — ${data.length} item(s) visible. ` +
              "(0 is expected before sign-in: Row-Level Security is doing its job.)"
          );
        }
      });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 520, textAlign: "center" }}>
        <Typography variant="h4" component="h1">
          Supabase connection check
        </Typography>

        {status === "loading" && (
          <Stack direction="row" spacing={1.5} sx={{ justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={20} />
            <Typography>Checking the connection…</Typography>
          </Stack>
        )}

        {status === "ok" && (
          <Chip color="primary" label="Connected ✓" sx={{ alignSelf: "center" }} />
        )}

        {status === "error" && (
          <Chip color="tertiary" label="Connection error ✗" sx={{ alignSelf: "center" }} />
        )}

        {detail && (
          <Typography variant="body2" color="text.secondary">
            {detail}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
