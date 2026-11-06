# ADR-0003: Use Supabase for database and authentication

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

Momentum's mission is to offer people with ADHD an easier way to budget money
and manage time. It needs to remember bills and tasks between visits, handle
sign-in/accounts, and enforce Row-Level Security (each person sees only their own
data) — so we needed a place for the data to be stored.

## Options considered

### What shape of database?

- **Relational (chosen)** — a user can easily create tasks tied to budget
  categories, all kept in their profile.
- **Non-relational** — better for loosely-shaped, fast-changing, flexible data
  where strict links between records don't matter.

### Who runs it?

- **Run your own PostgreSQL** — rent a server, install the database, run and
  maintain it yourself. More control, more work.
- **Supabase (chosen)** — someone else hosts the database, and it comes with
  sign-in/accounts and Row-Level Security built in. Less work, less control.

## Decision

We will use **Supabase** (a hosted relational database), because it's hosted
(no server to run), free to start, and gives us authentication + Row-Level
Security for free — so each user sees only their own data.

## Consequences

- **Easier:** remembers bills/tasks between visits; handles sign-in/accounts;
  enforces Row-Level Security.
- **Harder / trade-offs:** steeper learning curve; we have to run a database
  migration whenever we want to change how a data object looks.
- **Next steps:** design the tables, turn on Row-Level Security, and add the
  Supabase keys to `.env` (gitignored) and to Vercel's environment variables.
