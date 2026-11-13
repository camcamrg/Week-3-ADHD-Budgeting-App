# ADR-0004: Serve database calls from the server, not the browser

- **Status:** Accepted
- **Date:** 2026-11-09

## Context

The assignment's build steps say database calls should come from the server, not
the browser. I initially did the opposite — the screens talked to the database
directly — so I moved all database calls out of the browser and into server code.

## Options considered

- **Keep browser calls + RLS (what I had)** — the screens call the database
  directly, with Row-Level Security as the only lock. Faster to build.
- **Move calls to the server + keep RLS (chosen)** — the screens call server
  actions, which talk to the database; RLS stays on as a second lock. More setup,
  but more secure.

## Decision

We will move all database calls to the server (server actions) and keep Row-Level
Security turned on. Keeping browser calls would have been faster to develop, but
moving the calls to the server adds an extra layer of security and matches the
three-tier design the class teaches.

## Consequences

- **Easier / better:** matches the three-tier design; the server re-checks who the
  user is on every call; two independent locks (server + RLS) instead of one.
- **Harder / trade-offs:** slower development speed — more moving parts (a server
  Supabase client, a proxy to keep sessions fresh, and a server action for each
  database job).
- **Next steps:** test that one user cannot see another user's data, then keep
  building features.
