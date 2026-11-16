# Momentum — Test Cases

**What this is:** the concrete, by-hand test recipes that prove Momentum works. Where
[`use-cases-and-bdd.md`](./use-cases-and-bdd.md) says *what* the app should do, this
document says *exactly how to check it*: the data to enter, the steps to take, and the
result to look for. Run these against the live app before every submission.

**How to use it**
- Work top to bottom. Each test case lists **Preconditions**, **Steps**, and the
  **Expected result**.
- Fill in the **Result** column as you go: ✅ Pass, ❌ Fail, or ⬜ Not run.
- If one fails, note what you actually saw — that note is the bug report.
- "Traces to" links each test back to the use case (UC) and BDD feature it proves, so
  nothing in the spec goes unchecked.

**Test accounts used below**
- **Account A** — your main test email.
- **Account B** — a second email (used only for the privacy/isolation tests).

---

## TC-1 — Passwordless sign-in
*Traces to: UC-1 · BDD "Passwordless sign-in"*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 1.1 | Open the app signed out → go to the sign-in page → enter email → tap "Send me a link" | Account A email | A confirmation message says a sign-in link was sent | ⬜ |
| 1.2 | Open the sign-in link in the email **right away** | the latest link | A session is created and you land on Home | ⬜ |
| 1.3 | Return to the sign-in page on the same device after signing in once | — | Email is pre-filled and the heading reads "Welcome back" | ⬜ |
| 1.4 | Open the sign-in callback URL with no / an invalid code | strip the code from the URL | You're returned to sign-in with a visible error (no crash) | ⬜ |
| 1.5 | While already signed in, open the sign-in page | — | You're taken straight to Home | ⬜ |

> Note: if a link says "expired," request a fresh one and use it immediately — email
> scanners can "pre-click" and burn a one-time link.

---

## TC-2 — Welcome / landing page
*Traces to: UC-9 · BDD "Welcome / landing page"*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 2.1 | Open the landing page while **signed out** | You see "Get started" and "I already have an account"; both lead to sign-in | ✅ |
| 2.2 | Open the landing page while **signed in** | You see a single "Continue" button that goes to Home | ⬜ |

---

## TC-3 — Account status page
*Traces to: UC-10 · BDD "Account status page"*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 3.1 | Signed in, open the account page | Shows "Signed in as &lt;your email&gt;" with a way into the app and a Sign out button | ⬜ |
| 3.2 | Signed out, open the account page | Tells you there's no active session and offers a sign-in link | ✅ |

---

## TC-4 — Protected pages (access guard)
*Traces to: UC-1 · BDD "Protected pages"*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 4.1 | Signed out, open Home directly by URL | Redirected to the sign-in page | ✅ |
| 4.2 | Signed out, open The List directly by URL | Redirected to the sign-in page | ✅ |

---

## TC-5 — Money setup & Safe-to-Spend
*Traces to: UC-2, UC-3 · BDD "Safe-to-Spend on Home"*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 5.1 | Fresh account, open Home before entering a balance | — | You're prompted to add your balance to see what's safe to spend | ⬜ |
| 5.2 | Enter a balance, leave monthly income blank, save | Balance **$1,000** | Saves fine; Safe-to-Spend calculates without needing income | ⬜ |
| 5.3 | Add one unpaid bill, return to Home | Balance **$1,000**, bill **$300** | Safe-to-Spend shows **$700.00** | ✅ |
| 5.4 | Make bills exceed the balance | Balance **$200**, bills total **$500** | Safe-to-Spend shows **-$300.00** with a kind, shame-free message | ⬜ |
| 5.5 | Mark a bill done, return to Home | Balance **$1,000**, a **$300** bill marked done | Safe-to-Spend returns to **$1,000.00** (paid bills don't reduce it) | ⬜ |

---

## TC-6 — Your next thing (Home)
*Traces to: UC-2 · BDD "Your next thing on Home"*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 6.1 | Have two unpaid items due on different dates, open Home | bill due **2026-12-01**, task due **2026-11-20** | "Your next thing" shows the task due 2026-11-20 (the soonest) | ⬜ |
| 6.2 | Complete / delete all items, open Home | — | "Your next thing" says you're all caught up | ⬜ |

---

## TC-7 — The List: add, complete, delete
*Traces to: UC-4, UC-5, UC-6 · BDD "The List — add, complete, delete"*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 7.1 | Add a bill with amount + due date | "Electric", **$85**, due **2026-11-25** | Appears tagged **Bill**, showing $85.00 and the due date | ⬜ |
| 7.2 | Add a task with no amount | "Call the dentist" | Appears tagged **Task** with no amount | ⬜ |
| 7.3 | View a list with several due dates | — | Items are ordered soonest-due first | ⬜ |
| 7.4 | Clear the title field | empty title | "Add to my list" button is disabled | ⬜ |
| 7.5 | Tick an item's checkbox | any non-recurring item | Shows completed, with a line through it | ⬜ |
| 7.6 | Un-tick a done item | the item from 7.5 | Returns to active; counts toward Safe-to-Spend and "next thing" again | ⬜ |
| 7.7 | Tap Delete on an item | any item | Removed from the List and all totals | ⬜ |

---

## TC-8 — Recurring items
*Traces to: UC-11 · BDD "Recurring items"*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 8.1 | Add a bill, tick "Repeats", choose "Every month", add | "Rent", recurs **monthly** | Appears with a repeat badge showing "monthly" | ⬜ |
| 8.2 | Tick off a monthly recurring bill | "Rent" due **2026-11-01** | Does **not** stay crossed out; due date rolls to **2026-12-01** and it stays active | ⬜ |
| 8.3 | Tick off a one-off bill | "Electric", not repeating | Shows completed with a line through it; does **not** roll forward | ⬜ |

---

## TC-9 — Due-soon reminders (in-app nudge)
*Traces to: new in-app reminder feature (badges on The List + "Heads up" card on Home + lead-days control)*

| # | Steps | Test data | Expected result | Result |
|---|-------|-----------|-----------------|--------|
| 9.1 | Set the reminder window in the money form | "Remind me this many days ahead" = **3** | Value saves and persists after reload | ⬜ |
| 9.2 | Have an item due within the window | due in **2 days**, lead = 3 | The List shows a "⏰ in 2 days" badge (warning colour) | ✅ |
| 9.3 | Have an item due today | due **today** | Badge reads "⏰ due today" | ⬜ |
| 9.4 | Have an overdue item | due **yesterday** | Badge reads "⚠️ 1 day overdue" in an error (red) colour | ⬜ |
| 9.5 | Have an item outside the window | due in **10 days**, lead = 3 | No urgency badge appears on that item | ⬜ |
| 9.6 | Open Home with 1+ items due within the window | — | A "Heads up — N things due soon" card lists each one with its badge | ✅ |
| 9.7 | Open Home with nothing due within the window | — | No "Heads up" card is shown | ⬜ |
| 9.8 | Mark a due-soon item done | — | Its badge disappears (done items aren't nagged) and it drops off the Heads-up card | ⬜ |
| 9.9 | Change the lead-days value and re-check | lead **3 → 1** | An item due in 2 days no longer counts as "due soon"; raising it back includes it again | ⬜ |
| 9.10 | Update only the balance (leave lead-days untouched) | — | The saved reminder window is **not** wiped | ⬜ |

---

## TC-10 — Theme & sign out
*Traces to: UC-7, UC-8 · BDD "Theme and sign-out"*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 10.1 | First open with no theme chosen | App matches the device's light/dark setting | ⬜ |
| 10.2 | Tap the theme toggle | App switches light ↔ dark immediately, everywhere | ⬜ |
| 10.3 | Tap "Sign out" | Session ends; Home is no longer reachable without signing in again | ⬜ |

---

## TC-11 — Data privacy / isolation (RLS)
*Traces to: BDD "Data privacy / isolation" · security requirement (Row-Level Security)*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 11.1 | As **Account A**, add an item. In an incognito window, sign in as **Account B** and open The List | Account B sees an empty list — none of Account A's data | ✅ |
| 11.2 | Return to **Account A**'s session and open The List | Account A's item is still there | ✅ |
| 11.3 | Attempt to read the `items` table while logged out (e.g. a direct query script) | Zero rows returned — the database refuses, not just the screen | ⬜ |

---

## TC-12 — Friendly error handling
*Traces to: BDD "Friendly error handling"*

| # | Steps | Expected result | Result |
|---|-------|-----------------|--------|
| 12.1 | Simulate a failed data load (e.g. offline), open Home or The List | A calm error message appears instead of a broken screen | ⬜ |
| 12.2 | Simulate a failed save while adding an item or saving money | A clear "didn't save" message appears, and what you typed is not lost | ⬜ |

---

## Test run log

Record each full pass so you can show the app was verified before submission.

| Date | Tester | Build / commit | Pass | Fail | Notes |
|------|--------|----------------|------|------|-------|
| 2026-11-16 | Cameron | `4dc2184` (production) | 9 | 0 | Hand-tested on the live production site (https://week-3-adhd-budgeting-app.vercel.app). See the per-scenario results below. |

### 2026-11-16 run — detail

Tested against **live production** (`main` @ `4dc2184`) after the first launch.

**Signed-out scenarios (verified in-browser):**
- **TC-2.1** Landing page signed out → both "Get started" and "I already have an account" present. ✅ Pass
- **TC-3.2** Account page signed out → "Not signed in" message shown. ✅ Pass
- **TC-4.1** Opening `/home` signed out → redirected to the sign-in page. ✅ Pass
- **TC-4.2** Opening `/list` signed out → redirected to the sign-in page. ✅ Pass

**Signed-in scenarios (hand-tested by Cameron):**
- **TC-5.3** Balance $1,000 − unpaid bill $300 → Home Safe-to-Spend shows **$700.00**. ✅ Pass
- **TC-9.2** Item due in 2 days → The List shows a "⏰ in 2 days" badge. ✅ Pass
- **TC-9.6** With a due-soon item → Home shows the "Heads up — … due soon" card. ✅ Pass

**Earlier in the project (data-isolation / RLS):**
- **TC-11.1** Second account (incognito) saw an empty list — none of Account A's data. ✅ Pass
- **TC-11.2** Account A still retained its own item afterward. ✅ Pass

Result: **9 scenarios run, 9 passed, 0 failed.**

---

*Keep this in sync with [`use-cases-and-bdd.md`](./use-cases-and-bdd.md) and
[`flows.md`](./flows.md): when behaviour changes, update the BDD scenario and its test
case together.*
