# Decisions to turn into ADRs later

A running list of decisions we've made in conversation but haven't yet written up
as formal Architectural Decision Records (ADRs). When we reach the ADR step of the
build, convert each of these into its own file under `docs/adr/`.

## Pending

### 1. Reminders: PWA push notifications + email, calendar sync deferred
- **Decision:** Momentum delivers proactive reminders through **PWA web push
  notifications** (service worker + a scheduled job) with **email reminders** as a
  reliable backstop. The app nudges users directly; it does **not** depend on a
  user's external calendar to remind them.
- **Calendar connection:** deferred, not in MVP. If added later, use the
  lightweight path — an "Add to Calendar" (`.ics`) button and/or a subscribable
  one-way feed (Momentum → user's calendar) — rather than full two-way
  Google/Apple OAuth sync.
- **Why:** Push + email covers the reminder need without the heavy OAuth,
  app-verification, and Apple CalDAV work that calendar sync requires. Follows
  "start simple, earn complexity." The List already shows items by due date, so
  the app is calendar-like on its own.
- **Date noted:** 2026-11-05

### 2. Business logic: Transaction Scripts for MVP; keep money & time cleanly typed
- **Decision:** Organize the domain layer as **Transaction Scripts** (one procedure
  per action: add item, show The List, mark done, send reminder, compute
  Safe-to-Spend) for MVP #1. Rules are simple today, so this is the simplest fit.
- **Money vs. time:** Keep "money items" and "time items" **cleanly distinguished
  in the data** from day one — either a `type` field on one shared items table, or
  two tables (bills / tasks). Exact shape decided at the database step. Both are
  "items with a due date," so The List unifies them and most scripts are shared;
  Safe-to-Spend is the only money-only rule.
- **Revisit when:** If rules tangle as deferred [MMP] features arrive (recurring
  tasks, AI task breakdown, budget rollover, shared budgets, spending-speed
  reminders), that's the signal to move toward a **Domain Model** (a MoneyItem and
  a TimeItem object, each holding its own rules). Clean data typing now makes that
  split tidy, not a rewrite.
- **Why:** "Start simple, earn complexity." Transaction Scripts are fast to build
  and easy to follow; clean money/time separation keeps the upgrade path open.
- **Date noted:** 2026-11-05
