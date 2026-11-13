# Troubleshooting — issues we hit and how we fixed them

A running log of the real problems that came up while building Momentum, what
caused each one, and the fix. Written so future-me (and anyone reading the repo)
doesn't have to rediscover them. Newest lessons tend to be the subtle ones, so
read the whole thing before a big change.

---

## 1. `fatal: not a git repository`

**What happened:** Git commands failed with "not a git repository (or any of the
parent directories)".

**Cause:** The terminal was sitting in the home folder (`~`), not inside the
project. Git only works when you're *inside* the project folder.

**Fix:** Move into the project first, then run git:

```bash
cd ~/Documents/Week-3-ADHD-Budgeting-App
```

**Lesson:** Always check your terminal is in the project folder before running
git. The prompt usually shows the folder name.

---

## 2. `.env.example` wasn't getting committed

**What happened:** We wanted to commit `.env.example` (a safe template with blank
values) but git kept ignoring it.

**Cause:** Our `.gitignore` had `.env*`, which matches **everything** starting
with `.env` — including `.env.example`.

**Fix:** Add an exception line *below* the `.env*` rule so the template is allowed
back in while the real secrets stay ignored:

```
.env*
!.env.example
```

**Lesson:** In `.gitignore`, a `!` line re-includes something a broader rule
excluded — and order matters (the exception must come after the rule).

---

## 3. db-check page: 500 error "Supabase env vars are missing"

**What happened:** The temporary `/db-check` page returned a 500 error saying the
Supabase environment variables were missing — even though we'd filled them in on
Vercel.

**Cause:** Two things:
- Vercel's env vars don't help the app running **locally** — local needs its own
  `.env` file (which is gitignored, so Vercel never sees it and vice versa).
- The local `.env` edits hadn't actually saved. The folder wasn't open in VS Code
  (editing a read-only preview instead of the real file).

**Fix:** Open the project folder properly in VS Code, paste the real values into
`.env`, and save:

```bash
cd ~/Documents/Week-3-ADHD-Budgeting-App
code .
```

Then edit `.env`, press ⌘S to save, and restart the dev server. Result:
"Connected ✓".

**Lesson:** Local and Vercel each need the env vars set separately. And make sure
you're editing the real file in an open folder, not a preview — then actually save.

---

## 4. Vercel production build failed: "Functions cannot be passed directly to Client Components"

**What happened:** The app ran fine with `npm run dev`, but the Vercel production
build failed on the welcome page (`/`) with a "Functions cannot be passed directly
to Client Components" error.

**Cause:** The welcome page was a Server Component, and it passed Next.js's `Link`
as `component={Link}` into an MUI `Button`. That pattern breaks the production
*prerender*. It works in dev because dev is more forgiving than a real build.

**Fix:** Add `"use client"` to the top of `app/page.tsx` so it's a Client
Component.

**Lesson:** The dev server is more lenient than a production build. Run the
production build locally *before* pushing, so you catch these early:

```bash
npm run build
```

---

## 5. iCloud duplicate files broke the build and dev server

**What happened (twice):** `next build` failed with "Duplicate identifier", and
the dev server complained about an "Unexpected file in persistence directory".

**Cause:** The project lives in `~/Documents`, which iCloud syncs. iCloud
sometimes creates duplicate copies named like `routes.d 2.ts` or `LOG 2` inside
the generated `.next` folder. Next.js sees two files that should be one and chokes.

**Fix:** Delete the generated build folder and rebuild/restart:

```bash
rm -rf .next
```

**Lesson:** `.next` is throwaway generated output — deleting it is always safe; it
regenerates. The real cause is iCloud syncing a code folder. Moving the project to
a non-synced location (e.g. `~/Developer`) would stop this for good (optional).

---

## 6. Supabase magic-link emails stopped sending (rate limit)

**What happened:** While testing sign-in repeatedly, the magic-link emails stopped
arriving and Supabase returned a rate-limit error.

**Cause:** The Supabase free tier limits how many auth emails it will send in a
window. We'd simply sent too many while testing.

**Fix:** Wait for the limit to reset (about an hour), or test against the live site
instead of hammering it locally. We also improved the login page to remember the
typed email *as soon as you submit* (before the network call), so a rate-limited
attempt doesn't lose what you typed.

**Lesson:** Auth emails are rate-limited on the free tier — don't spam the sign-in
button while testing.

---

## 7. Table editor said "no RLS policy" after enabling RLS

**What happened:** We turned on Row-Level Security, but Supabase's table editor
still warned there were no RLS policies.

**Cause:** Enabling RLS and *writing policies* are two separate steps. RLS on with
no policies means "deny everything" — secure, but nothing can be read or written,
and Supabase flags it.

**Fix:** Add the actual policies. We put them in
`supabase/migrations/0002_rls_policies.sql` (each user can only view/create/
update/delete their own rows, keyed on `auth.uid()`).

**Lesson:** RLS = default-deny. You must *also* write policies that say which rows
each user may touch.

---

## 8. Live site "isn't recognizing that I'm signed in"

**What happened:** After signing in on `localhost`, the live Vercel site didn't
show us as signed in (and vice versa).

**Cause:** Not a bug. Login sessions are stored **per domain**. A session created
on `localhost:3000` is a different domain from `week-3-adhd-budgeting-app.vercel.app`,
so they don't share sign-in.

**Fix:** Sign in separately on each domain you're using.

**Lesson:** `localhost` and your live URL are separate worlds for sessions, storage,
and cookies. Test sign-in on the domain you actually care about.

---

## Framework gotchas worth remembering

These aren't bugs we "fixed" so much as sharp edges in this particular stack.

### Material UI v9 — layout props go in `sx`
In MUI v9, layout props like `justifyContent`, `alignItems`, and `textAlign` must
go inside the `sx` prop, not as direct props on `Stack`. Verify MUI APIs against
the installed version (`node_modules`), don't assume — v9 is newer than much of the
training material.

### Next.js "Cache Components" — client components for Supabase reads
This project's Next.js (16.4.5) has **Cache Components** turned on. An uncached data
fetch in a Server Component needs either a `<Suspense>` boundary or a `use cache`
directive. That's *why* the data pages (`/db-check`, `/list`, `/home`, `/account`)
are Client Components (`"use client"`) using the browser Supabase client — it keeps
things simple and avoids that requirement.

### Server → Client boundary
You can't pass a function (or a component used as one, like `component={Link}`) from
a Server Component into a Client Component. See issue #4 — the fix is to make the
page a Client Component.

---

## The one habit that prevents most of these

Before every push:

```bash
npm run build
```

A local production build is stricter than the dev server and catches the problems
(#4, #5) *before* they fail on Vercel.
