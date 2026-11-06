# Momentum — project guide for Claude

Momentum is a calm, ADHD-friendly budgeting web app (money + time in one place).
Three-tier: Next.js + Material UI (screens) → Vercel (hosting) → Supabase (database).

## Architectural Decision Records

- Read every ADR in `docs/adr/` before making changes.
- Write a new ADR for every big, hard-to-change decision (framework, hosting,
  database, auth, major patterns).
- Never erase an old ADR. If a decision changes, write a new ADR and mark the old
  one "Superseded by ADR-XXXX".
- Use `docs/adr/template.md` as the format.

## Conventions

- Colours, fonts, and spacing come from the MUI theme (`app/theme.ts`) — never
  hardcode them in components.
- Keep secret keys out of the browser and out of git (use `.env`, which is gitignored).
- Build the simplest thing that works; earn complexity when a real need appears.
