# Momentum — Architecture Plan

This is the "how the app is built" plan: the three tiers, how data flows between
them, and how a user signs in. Written as the target design we build toward (see
also the ADRs in `docs/adr/` for *why* each major tool was chosen).

Momentum is a calm, ADHD-friendly app for money **and** time in one place. The MVP
is "two screens and one rule": a unified **List** of bills + tasks, and a **Home**
screen showing **Safe-to-Spend**.

---

## The three tiers

```
┌─────────────────────────────────────────────┐
│  TIER 1 — Screens (the browser)             │
│  Next.js + Material UI client components     │
│  Welcome · Login · Home · List · Account     │
└───────────────┬─────────────────────────────┘
                │ calls server actions (never the DB directly)
┌───────────────▼─────────────────────────────┐
│  TIER 2 — Server code (Vercel)              │
│  Server actions + /auth/callback route       │
│  + proxy (keeps the session fresh)           │
│  Holds the app's rules; talks to the DB      │
│  using the signed-in user's session          │
└───────────────┬─────────────────────────────┘
                │ SQL over the user's authenticated session
┌───────────────▼─────────────────────────────┐
│  TIER 3 — Database (Supabase / PostgreSQL)  │
│  Tables: profiles, items                      │
│  Row-Level Security = the second lock         │
└─────────────────────────────────────────────┘
```

### Tier 1 — Screens (what the user sees and clicks)
Built with Next.js (App Router) and Material UI v9, themed from `app/theme.ts`.

- **Welcome** (`app/page.tsx`) — intro; routes signed-in users onward.
- **Login** (`app/login/page.tsx`) — passwordless magic-link sign-in.
- **Account** (`app/account/page.tsx`) — where the magic link lands.
- **Home** (`app/home/page.tsx`) — Safe-to-Spend + the single next thing.
- **List** (`app/list/page.tsx`) — the unified bills + tasks list (add / done / delete).

Screens **do not talk to the database directly.** They call Tier 2 and render what
comes back.

### Tier 2 — Server code (the app's rules, running on Vercel)
This is where the database calls live. The browser asks the server to do a thing
(add an item, mark it done, set the balance); the server checks who the user is and
performs the database work on their behalf.

- **Server actions** — one function per action (add item, toggle done, delete item,
  compute/update balance). These run only on the server.
- **`/auth/callback` route** — receives the magic-link code and establishes the
  session as a secure cookie.
- **Proxy** (`proxy.ts` — Next.js 16's renamed middleware) — refreshes the session
  cookie on each request so sign-in sticks.
- **Server Supabase client** — reads the user's session from cookies, so every
  database call runs *as that user* and RLS applies.

Business logic style: **Transaction Scripts** (one procedure per action) — see
`docs/decisions-to-record.md`.

### Tier 3 — Database (Supabase / PostgreSQL)
Managed Postgres. Schema and access rules live as migrations in
`supabase/migrations/` so every change is recorded and repeatable.

- **`profiles`** — one row per user (balance, monthly income, reminder lead days).
- **`items`** — unified bills + tasks (`type` = `bill` | `task`, title, amount,
  due date, done flag).
- **Row-Level Security (RLS)** — default-deny; each user may only read/write rows
  where `user_id = auth.uid()`. This is the **second lock** behind the server.

---

## How data flows (example: adding a bill)

1. User fills the add form on **List** (Tier 1) and submits.
2. The screen calls the `addItem` **server action** (Tier 2).
3. The server reads the user's session from the cookie, then inserts the row into
   **Supabase** (Tier 3) as that user.
4. RLS confirms the row belongs to them (second lock).
5. The server tells the page to refresh; the new item appears.

## How sign-in works (passwordless magic link)

1. User enters their email on **Login**; we send a one-time sign-in link.
2. They click the link; it returns to **`/auth/callback`** (Tier 2).
3. The server exchanges the link's code for a session and stores it in a secure
   cookie.
4. The proxy keeps that cookie fresh on later visits, so the user stays signed in.

---

## Security notes
- Secret keys never reach the browser or git — they live in `.env` (gitignored) and
  in Vercel's environment settings. Only the public URL + publishable key are
  exposed, and RLS is what actually protects the data.
- **Two locks:** the server performs DB calls as the authenticated user, *and* RLS
  independently enforces per-user access at the database. Either alone would be
  safe; together they're defense in depth.

## Related decisions
- `docs/adr/0001` — Next.js + Material UI
- `docs/adr/0002` — Vercel for hosting
- `docs/adr/0003` — Supabase for database + auth
- `docs/adr/0004` — Server-side data access (browser → server → database)
