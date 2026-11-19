# Session handoff — Steady Ripple (Week 4 CI/CD + docs work)

**Purpose of this file:** a context primer to "dogfeed" a fresh Claude session so it can
pick up this project without re-discovering everything. Hand this file to the new session
first. Written 2026-11-16; last updated 2026-11-19 (rebrand + tagline).

> This is a working note, not a spec. The source-of-truth docs are
> [`use-cases-and-bdd.md`](./use-cases-and-bdd.md), [`flows.md`](./flows.md),
> [`test-cases.md`](./test-cases.md), and the ADRs in [`docs/adr/`](./adr/).

---

## 1. What Steady Ripple is

A calm, ADHD-friendly budgeting web app that puts **money + time in one place**.
Three-tier architecture:

- **Screens:** Next.js 16 (App Router) + Material UI v9
- **Hosting:** Vercel
- **Database:** Supabase (Postgres + Auth + Row-Level Security)

Built for Cameron's AI Development Residency. Live at
`https://steadyripple.vercel.app`.

### Stack specifics
- Next 16.4.5, React 19.3.0, MUI v9, `@supabase/ssr`, ESLint 9 (flat config:
  `eslint-config-next` core-web-vitals + typescript), TypeScript 5.
- Passwordless (magic-link) auth via Supabase.
- Theme (colours, fonts, spacing) lives in `app/theme.ts` — **never hardcode these in
  components** (project convention).

---

## 2. How Cameron works (important — honour these)

- **Cameron runs all git/terminal commands himself.** Give him commands in copy-ready
  `bash` blocks; don't run git for him unless he explicitly delegates.
- **He pastes provided code into VS Code himself.** When he says "done," verify by reading
  the file rather than assuming.
- He **delegates specific file ops** to Claude only when he says so (this session he
  delegated the skills copy, the validator script, and ci.yml edits).
- **Teach-me mode:** explain concepts first, plain language, one step at a time, warm tone.
  If he says "just do it," skip the teaching.
- Newer to coding — avoid jargon or define it in the same breath.

### Standing rules
- **Deploy gate:** `main` auto-deploys to **production** on every push. ALL feature work
  happens on the long-lived **`dev`** branch. Pushing `dev` = private preview only.
  Merging `dev` → `main` = launch. Run `npm run build` before launch.
- **Secrets:** keep keys out of the browser and out of git. `.env` is gitignored;
  `.env.example` holds placeholder keys only.
- **ADRs:** read every ADR in `docs/adr/` before changing architecture. Write a new ADR for
  big hard-to-change decisions; never erase an old one (mark it "Superseded by ADR-XXXX").
- **Commit messages** end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- **PR descriptions** end with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- **Privacy:** Cameron's email (`cameron.guest88@gmail.com`) is private — never send it to
  external services without explicit approval.
- **Do NOT edit** the shared Hat Check residency example Notion page.

---

## 3. What this session accomplished

### CI/CD pipeline (built from scratch — there was none before)
`.github/workflows/ci.yml` — **4 jobs that run on every push + PR**, each shows as a
separate GitHub check:

1. **Lint** — `npm ci` → `npm run lint`
2. **Type-check** — `npm ci` → `npx next typegen` → `npx tsc --noEmit`
3. **Build** — `npm ci` → `npm run build` (needs placeholder Supabase env vars, see gotchas)
4. **Skills** — `node scripts/check-skills.mjs` (validates `.claude/skills/*/SKILL.md`)

All jobs use `actions/checkout@v5`, `actions/setup-node@v5`, node-version 22.

The 5-item residency checklist is **complete**:
1. ✅ Pushed a change & watched Actions run
2. ✅ Broke something on purpose (temp-broke the write-tests skill) → pipeline caught it → restored
3. ✅ ≥3 new CI checks (we have 4)
4. ✅ Week 1 Claude Skills validated on every push (the Skills job)
5. ✅ Ran both test-case scenarios by hand on the live app, results recorded (9/9 pass)

### Supporting files
- `scripts/check-skills.mjs` — dependency-free Node ESM validator (uses only built-ins, so
  the CI job needs no `npm install`). Checks each skill folder's SKILL.md frontmatter has a
  non-empty `name` and `description`; exits non-zero on failure.
- `package.json` — added `"check:skills": "node scripts/check-skills.mjs"`.
- `.claude/skills/` — 5 Week-1 skills copied into the repo: accessible-design,
  open-pull-request, secret-management, ux-design, write-tests.
- `app/login/page.tsx` + `app/ThemeToggle.tsx` — scoped `eslint-disable
  react-hooks/set-state-in-effect` on the hydration-safe effects (reading localStorage /
  mounted flag — these are the correct pattern, so disable is justified, not a hack).

### Docs
- `docs/test-cases.md` — 12 test-case groups (TC-1…TC-12) as tables, each "Traces to" its
  UC/BDD, plus a run log. Columns: `# | Preconditions | Steps | [Test data] | Expected
  result | Actual result | Result`. 9 scenarios pre-filled ✅; rest ⬜. **This is the repo
  source of truth for tests.**
- Consolidated Notion page "Use Cases, BDD, Flows & Tests" (id
  `419c448e-a893-814e-86ce-d68b4d0a2c73`) now holds Use Cases + BDD + 5 User Flow tables +
  12 Test Case tables + run log.
- Notion hub (`411c448e-a893-8141-b85d-defb09fbbafa`) header → "Launched 🚀"; added a
  collapsible "⚙️ CI Workflow" toggle with the full ci.yml; added a build-progress log entry.
- Notion backlog: "Proactive reminders" → Done; created "CI pipeline (GitHub Actions)" and
  "Test cases & manual test pass" (both Phase 7 — Hardening, Done).

### Launched
- CI work: merged `dev` → `main` (commit `4dc2184`), live in production.
- Rebrand + tagline (2026-11-18/19): further `dev` → `main` merges shipped the
  Momentum → Steady Ripple rename and the new landing tagline.

### Rebrand: Momentum → Steady Ripple (complete, 2026-11-18/19)
- **New name + URL:** app renamed Momentum → **Steady Ripple**, live at
  `https://steadyripple.vercel.app` (Vercel *project* renamed to claim the URL; the old
  `week-3-adhd-budgeting-app.vercel.app` still works as a fallback).
- **No code change was needed for the URL move:** the login redirect is built from
  `window.location.origin`, so it follows whatever domain serves the app. The one hard
  dependency was Supabase's Auth **redirect allow-list** — the new URL had to be added there
  (kept the old URL + `localhost` too) or magic-link sign-in breaks. Sign-in was verified
  end-to-end on the new URL.
- **Repo:** every `Momentum` → `Steady Ripple` (code, docs, comments); `package.json` name →
  `steady-ripple`; `.claude/launch.json` name; localStorage key → `steadyripple:lastEmail`
  (returning users retype their email once — harmless).
- **Landing tagline (2026-11-19):** [app/page.tsx](app/page.tsx) now reads *"Small choices,
  steady ripples. Each decision about your money and your time builds on the last — until
  staying on top of things feels like a habit, not a battle."*
- **Notion:** the hub, its nested pages (Vision, Use Cases, Backlog, Architecture), the
  Product Specifications page, and the Build Backlog database are all renamed to Steady
  Ripple. The hub's rename log keeps the one intentional "Momentum → Steady Ripple" line.
- **Name choice:** picked after checking that distinctive single/invented words were mostly
  taken (Ripple, Driftless, Traction, Echo, NextStep, Undrift, EchoFlow). "Steady Ripple" =
  calm/steady (ADHD-friendly) + ripple (choices compounding); `steadyripple.vercel.app` was
  the rare exact-match that was free.

---

## 4. CI gotchas (hard-won — don't re-learn these)

- **Build job needs placeholder env vars.** `lib/supabaseClient.ts` throws at module load
  if `NEXT_PUBLIC_SUPABASE_*` are missing, which fails the build in clean CI. The build job
  sets `NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder-anon-key`.
- **Type-check needs `npx next typegen` before `tsc`.** Next 16 auto-generates route types
  like `LayoutProps` into `.next/types/` (loaded via `next-env.d.ts`). They exist locally
  but not in clean CI, so `tsc --noEmit` fails with "Cannot find name 'LayoutProps'" unless
  typegen runs first.
- **`react-hooks/set-state-in-effect`** flags synchronous setState in effects. The
  login/ThemeToggle effects are the correct hydration-safe pattern, so scoped
  `eslint-disable` is the right fix (not refactoring).

### Notion escaping rule (cost real time this session)
- `notion-update-page` with `command: replace_content` or `insert_content` (string params
  `new_str`/`content`) needs **REAL newline characters** — `\n` escape sequences get stored
  **literally** and break all markdown rendering.
- But `command: update_content` with the `content_updates` **array** (JSON-decoded) **does**
  work correctly with `\n`. Prefer that for structured edits.

---

## 5. Open / pending items

- **Supabase project *label*** — dashboard-cosmetic only; rename it to "Steady Ripple" if not
  already done. Nothing depends on it (the database, keys, and URLs are unaffected).
- **Submission:** email to `mdenner@techfleet.org` (per the Week 2 Coding Challenge page).
- **Remaining MVP epics/features** — estimated ~8–12 sessions, not started.
- **Dev server** was left paused at the end of the rebrand session; restart it when needed.

---

## 6. Where things live

- App code: `app/` (App Router pages + components), `lib/supabaseClient.ts`
- Theme: `app/theme.ts`
- CI: `.github/workflows/ci.yml`, `scripts/check-skills.mjs`
- Skills: `.claude/skills/`
- Docs: `docs/use-cases-and-bdd.md`, `docs/flows.md`, `docs/test-cases.md`, `docs/adr/`
- Notion: hub `411c448e-a893-8141-b85d-defb09fbbafa` (now titled "Steady Ripple");
  consolidated Use Cases/BDD/Flows/Tests page `419c448e-a893-814e-86ce-d68b4d0a2c73`;
  Product Specifications `405c448e-a893-81e5-8f23-d1cbccc70410`; Build Backlog database
  `95af0f6f-8f5d-4808-ade4-dbf360a7017d`
- Claude memory: `/Users/cameronguest/.claude/projects/-Users-cameronguest-Documents-Week-3-ADHD-Budgeting-App/memory/`
