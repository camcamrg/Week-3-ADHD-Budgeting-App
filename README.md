# Momentum

A calm, ADHD-friendly budgeting app that keeps **money and time in one place**.

Most budgeting apps assume you'll remember to come back, read a chart, and do the
math. Momentum is built the opposite way: it's quiet, it tells you the one number
and the one next thing, and it's forgiving when you've been away. The whole MVP is
**"two screens and one rule":**

- **The List** — your bills *and* your tasks in a single list, sorted by what's due next.
- **Home** — your **Safe-to-Spend** (money you can spend without missing a bill) plus the single next thing to do.

🔗 **Live app:** https://week-3-adhd-budgeting-app.vercel.app/

---

## How it's built (three tiers)

```
Screens (browser)  →  Server code (Vercel)  →  Database (Supabase)
Next.js + MUI         Server Actions + auth      Postgres + Row-Level Security
```

- **Tier 1 — Screens:** [Next.js](https://nextjs.org) 16 (App Router, React 19) with [Material UI](https://mui.com) v9, themed from `app/theme.ts` (warm palette, Lexend font, light/dark).
- **Tier 2 — Server code:** all database work runs in **Server Actions** (`app/actions/`), never from the browser. A `proxy.ts` keeps the sign-in session fresh, and `app/auth/callback` handles magic-link sign-in.
- **Tier 3 — Database:** [Supabase](https://supabase.com) Postgres. Two tables (`profiles`, `items`), with the schema and access rules stored as migrations in `supabase/migrations/`.

**Sign-in is passwordless** — you get a one-time magic link by email, no password to remember.

**Security = two locks:** the server performs every database call as the signed-in
user, *and* Row-Level Security (RLS) independently enforces "you can only see your
own rows" at the database. Either lock alone would be safe; together they're
defense in depth. See [`docs/architecture.md`](docs/architecture.md).

---

## Run it on your computer

**You'll need:** [Node.js](https://nodejs.org) 20+ and a free [Supabase](https://supabase.com) project.

1. **Get the code and install:**
   ```bash
   git clone git@github.com:camcamrg/Week-3-ADHD-Budgeting-App.git
   cd Week-3-ADHD-Budgeting-App
   npm install
   ```

2. **Add your keys.** Copy the template and fill in your Supabase values:
   ```bash
   cp .env.example .env
   ```
   Then set in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   > `.env` is gitignored — real keys never go into GitHub.

3. **Set up the database.** In your Supabase project's SQL Editor, run the migration
   files in order: `supabase/migrations/0001_init.sql`, then `0002_rls_policies.sql`.

4. **Start it:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (run this before pushing — it's stricter than dev) |
| `npm run start` | Serve the production build |
| `npm run lint` | Check code style |

---

## How changes get deployed

Vercel hosts the app and auto-publishes the **`main`** branch. To keep untested work
off the live site, building happens on the **`dev`** branch:

```
build on dev  →  test (locally + Vercel preview)  →  merge dev → main  →  live
```

Pushing `dev` only creates a private Vercel **preview** — never the public site. Only
merging into `main` launches.

---

## Project docs

- [`docs/architecture.md`](docs/architecture.md) — the three-tier design and data flow
- [`docs/adr/`](docs/adr/) — Architecture Decision Records (why Next.js + MUI, Vercel, Supabase, server-side data access)
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — real problems hit while building, and their fixes

---

*Built for the AI Development Residency (Week 4).*
