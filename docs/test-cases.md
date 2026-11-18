# Steady Ripple — Test Cases

**What this is:** the concrete, by-hand test recipes that prove Steady Ripple works. Where
[`use-cases-and-bdd.md`](./use-cases-and-bdd.md) says *what* the app should do, this
document says *exactly how to check it*: the preconditions, the data to enter, the steps,
and the result to look for. Run these against the live app before every submission.

**How to use it**
- Work top to bottom. Each test case lists **Preconditions** (what must be true first),
  **Steps**, and the **Expected result**.
- Write what you saw in the **Actual result** column, then fill in the **Result** column:
  ✅ Pass, ❌ Fail, or ⬜ Not run.
- If one fails, the Actual-result note is the bug report.
- "Traces to" links each test back to the use case (UC) and BDD feature it proves, so
  nothing in the spec goes unchecked.

**Test accounts used below**
- **Account A** — your main test email.
- **Account B** — a second email (used only for the privacy/isolation tests).

---

## TC-1 — Passwordless sign-in
*Traces to: UC-1 · BDD "Passwordless sign-in"*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 1.1 | Signed out, on the sign-in page | Enter email → tap "Send me a link" | Account A email | A confirmation message says a sign-in link was sent | | ⬜ |
| 1.2 | A sign-in link was just requested | Open the sign-in link **right away** | the latest link | A session is created and you land on Home | | ⬜ |
| 1.3 | Signed in on this device before | Return to the sign-in page | — | Email is pre-filled and the heading reads "Welcome back" | | ⬜ |
| 1.4 | Signed out | Open the sign-in callback URL with no / an invalid code | strip the code from the URL | You're returned to sign-in with a visible error (no crash) | | ⬜ |
| 1.5 | Signed in (active session) | Open the sign-in page | — | You're taken straight to Home | | ⬜ |

> Note: if a link says "expired," request a fresh one and use it immediately — email
> scanners can "pre-click" and burn a one-time link.

---

## TC-2 — Welcome / landing page
*Traces to: UC-9 · BDD "Welcome / landing page"*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 2.1 | Signed out | Open the landing page | You see "Get started" and "I already have an account"; both lead to sign-in | Both buttons shown on live site | ✅ |
| 2.2 | Signed in | Open the landing page | You see a single "Continue" button that goes to Home | | ⬜ |

---

## TC-3 — Account status page
*Traces to: UC-10 · BDD "Account status page"*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 3.1 | Signed in | Open the account page | Shows "Signed in as &lt;your email&gt;" with a way into the app and a Sign out button | | ⬜ |
| 3.2 | Signed out | Open the account page | Tells you there's no active session and offers a sign-in link | "Not signed in" shown on live site | ✅ |

---

## TC-4 — Protected pages (access guard)
*Traces to: UC-1 · BDD "Protected pages"*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 4.1 | Signed out | Open Home directly by URL | Redirected to the sign-in page | Redirected to /login | ✅ |
| 4.2 | Signed out | Open The List directly by URL | Redirected to the sign-in page | Redirected to /login | ✅ |

---

## TC-5 — Money setup & Safe-to-Spend
*Traces to: UC-2, UC-3 · BDD "Safe-to-Spend on Home"*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 5.1 | Signed in; no balance set yet | Open Home | — | You're prompted to add your balance to see what's safe to spend | | ⬜ |
| 5.2 | Signed in | Enter a balance, leave monthly income blank, save | Balance **$1,000** | Saves fine; Safe-to-Spend calculates without needing income | | ⬜ |
| 5.3 | Signed in; balance is $1,000 | Add one unpaid bill, return to Home | bill **$300** | Safe-to-Spend shows **$700.00** | Showed $700.00 | ✅ |
| 5.4 | Signed in; balance is $200 | Add bills over the balance, return to Home | bills total **$500** | Safe-to-Spend shows **-$300.00** with a kind, shame-free message | | ⬜ |
| 5.5 | Signed in; balance $1,000, a $300 bill exists | Mark the bill done, return to Home | — | Safe-to-Spend returns to **$1,000.00** (paid bills don't reduce it) | | ⬜ |

---

## TC-6 — Your next thing (Home)
*Traces to: UC-2 · BDD "Your next thing on Home"*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 6.1 | Signed in; two unpaid items on different dates | Open Home | bill due **2026-12-01**, task due **2026-11-20** | "Your next thing" shows the task due 2026-11-20 (the soonest) | | ⬜ |
| 6.2 | Signed in; no unpaid items | Open Home | — | "Your next thing" says you're all caught up | | ⬜ |

---

## TC-7 — The List: add, complete, delete
*Traces to: UC-4, UC-5, UC-6 · BDD "The List — add, complete, delete"*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 7.1 | Signed in; on The List | Add a bill with amount + due date | "Electric", **$85**, due **2026-11-25** | Appears tagged **Bill**, showing $85.00 and the due date | | ⬜ |
| 7.2 | Signed in; on The List | Add a task with no amount | "Call the dentist" | Appears tagged **Task** with no amount | | ⬜ |
| 7.3 | Signed in; items on several dates | View the list | — | Items are ordered soonest-due first | | ⬜ |
| 7.4 | Signed in; on The List | Clear the title field | empty title | "Add to my list" button is disabled | | ⬜ |
| 7.5 | Signed in; an active item exists | Tick the item's checkbox | any non-recurring item | Shows completed, with a line through it | | ⬜ |
| 7.6 | Signed in; a done item exists | Un-tick the item | the item from 7.5 | Returns to active; counts toward Safe-to-Spend and "next thing" again | | ⬜ |
| 7.7 | Signed in; an item exists | Tap Delete on the item | any item | Removed from the List and all totals | | ⬜ |

---

## TC-8 — Recurring items
*Traces to: UC-11 · BDD "Recurring items"*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 8.1 | Signed in; on The List | Add a bill, tick "Repeats", choose "Every month", add | "Rent", recurs **monthly** | Appears with a repeat badge showing "monthly" | | ⬜ |
| 8.2 | Signed in; "Rent" monthly bill exists | Tick off the monthly recurring bill | "Rent" due **2026-11-01** | Does **not** stay crossed out; due date rolls to **2026-12-01** and it stays active | | ⬜ |
| 8.3 | Signed in; a one-off bill exists | Tick off the one-off bill | "Electric", not repeating | Shows completed with a line through it; does **not** roll forward | | ⬜ |

---

## TC-9 — Due-soon reminders (in-app nudge)
*Traces to: new in-app reminder feature (badges on The List + "Heads up" card on Home + lead-days control)*

| # | Preconditions | Steps | Test data | Expected result | Actual result | Result |
|---|---|---|---|---|---|---|
| 9.1 | Signed in | Set the reminder window in the money form | "Remind me this many days ahead" = **3** | Value saves and persists after reload | | ⬜ |
| 9.2 | Signed in; lead = 3 | Have an item due within the window | due in **2 days** | The List shows a "⏰ in 2 days" badge (warning colour) | "in 2 days" badge shown | ✅ |
| 9.3 | Signed in; lead = 3 | Have an item due today | due **today** | Badge reads "⏰ due today" | | ⬜ |
| 9.4 | Signed in | Have an overdue item | due **yesterday** | Badge reads "⚠️ 1 day overdue" in an error (red) colour | | ⬜ |
| 9.5 | Signed in; lead = 3 | Have an item outside the window | due in **10 days** | No urgency badge appears on that item | | ⬜ |
| 9.6 | Signed in; an item due soon exists | Open Home | — | A "Heads up — N things due soon" card lists each one with its badge | Heads-up card appeared | ✅ |
| 9.7 | Signed in; nothing due soon | Open Home | — | No "Heads up" card is shown | | ⬜ |
| 9.8 | Signed in; a due-soon item exists | Mark the due-soon item done | — | Its badge disappears and it drops off the Heads-up card | | ⬜ |
| 9.9 | Signed in; an item due in 2 days | Change the lead-days value and re-check | lead **3 → 1** | The item no longer counts as "due soon"; raising it back includes it again | | ⬜ |
| 9.10 | Signed in; reminder window already set | Update only the balance (leave lead-days untouched) | — | The saved reminder window is **not** wiped | | ⬜ |

---

## TC-10 — Theme & sign out
*Traces to: UC-7, UC-8 · BDD "Theme and sign-out"*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 10.1 | First open, no theme chosen | Open the app | App matches the device's light/dark setting | | ⬜ |
| 10.2 | App open | Tap the theme toggle | App switches light ↔ dark immediately, everywhere | | ⬜ |
| 10.3 | Signed in | Tap "Sign out" | Session ends; Home is no longer reachable without signing in again | | ⬜ |

---

## TC-11 — Data privacy / isolation (RLS)
*Traces to: BDD "Data privacy / isolation" · security requirement (Row-Level Security)*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 11.1 | Two accounts (A and B) exist | As Account A add an item; in incognito sign in as Account B and open The List | Account B sees an empty list — none of Account A's data | Account B saw empty list | ✅ |
| 11.2 | Account A has an item | Return to Account A's session and open The List | Account A's item is still there | Account A item retained | ✅ |
| 11.3 | Signed out | Attempt to read the `items` table (e.g. a direct query script) | Zero rows returned — the database refuses, not just the screen | | ⬜ |

---

## TC-12 — Friendly error handling
*Traces to: BDD "Friendly error handling"*

| # | Preconditions | Steps | Expected result | Actual result | Result |
|---|---|---|---|---|---|
| 12.1 | Signed in | Simulate a failed data load (e.g. offline), open Home or The List | A calm error message appears instead of a broken screen | | ⬜ |
| 12.2 | Signed in; adding an item or saving money | Simulate a failed save | A clear "didn't save" message appears, and what you typed is not lost | | ⬜ |

---

## Test run log

Record each full pass so you can show the app was verified before submission.

| Date | Tester | Build / commit | Pass | Fail | Notes |
|------|--------|----------------|------|------|-------|
| 2026-11-16 | Cameron | `4dc2184` (production) | 9 | 0 | Hand-tested on the live production site (https://week-3-adhd-budgeting-app.vercel.app). Per-scenario results in the Actual-result column above. |

**2026-11-16 run — detail.** Tested against **live production** (`main` @ `4dc2184`) after the
first launch. Signed-out (verified in-browser): TC-2.1, TC-3.2, TC-4.1, TC-4.2. Signed-in
(hand-tested by Cameron): TC-5.3 (Safe-to-Spend $700.00), TC-9.2 (due-soon badge), TC-9.6
(Home Heads-up card). Earlier data-isolation: TC-11.1, TC-11.2. **Result: 9 run, 9 passed,
0 failed.**

---

*Keep this in sync with [`use-cases-and-bdd.md`](./use-cases-and-bdd.md) and
[`flows.md`](./flows.md): when behaviour changes, update the BDD scenario and its test
case together.*
