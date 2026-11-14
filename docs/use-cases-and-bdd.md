# Momentum — Use Cases & BDD Scenarios

**What this is:** the documented requirements for Momentum (MVP #1), written in two
layers. **Use cases** describe *what a person is trying to do*. **BDD scenarios**
(Given / When / Then) describe *the exact, testable behaviour* that proves each use
case works. Together they double as (1) the backlog ticket's acceptance criteria and
(2) a manual test checklist to run against the live app before submitting.

Scope note: everything in the "Built" sections below is implemented today. The
"Planned (not yet built)" section at the end lists behaviour the spec intends but the
MVP does not do yet, so this document never over-claims.

---

## Actors

- **User** — an adult with ADHD managing money + time in one place. The only human actor.
- **System** — the Momentum app (Next.js screens) plus Supabase (database + auth).

---

## Use cases (Built)

### UC-1 — Sign in without a password
- **Goal:** get into the app with no password to remember.
- **Precondition:** the user has an email address.
- **Main flow:** User opens the app → enters their email → System emails a one-time
  sign-in link → User clicks it → System creates a session → User lands on Home.
- **Outcome:** the user is signed in; no password is ever created or stored.

### UC-2 — See the daily glance (Home)
- **Goal:** in one look, know what's safe to spend and the single next thing to handle.
- **Precondition:** signed in.
- **Main flow:** User opens Home → System shows **Safe-to-Spend** (current balance minus
  unpaid bills) and **Your next thing** (the soonest-due unpaid item).
- **Outcome:** the user orients in seconds without reading a long list.

### UC-3 — Set up or update my money
- **Goal:** tell the app my current balance (and optionally monthly income) so
  Safe-to-Spend is real.
- **Precondition:** signed in.
- **Main flow:** User taps "Set up my money" / "Update balance" → enters balance (and
  optional income) → System saves it → Home recalculates Safe-to-Spend.
- **Outcome:** Safe-to-Spend reflects the user's real numbers.

### UC-4 — Add a bill or a task to my List
- **Goal:** capture a bill (money) or a task (time) in one place.
- **Precondition:** signed in.
- **Main flow:** User opens The List → chooses **Bill** or **Task** → types a title →
  (bills) enters an amount → optionally picks a due date → taps "Add to my list".
- **Outcome:** the item appears on the List, sorted soonest-due first, and feeds Home.

### UC-5 — Mark an item done (or undo it)
- **Goal:** check off a paid bill or finished task.
- **Precondition:** signed in; at least one item exists.
- **Main flow:** User ticks the item's checkbox → System marks it done → the item shows
  as completed and drops out of Safe-to-Spend and "next thing". Un-ticking reverses it.
- **Outcome:** done items stop adding noise and stop counting against money.
- **Note:** a *recurring* item does not stay done — completing it rolls its due date to
  the next cycle and keeps it active (see UC-11).

### UC-6 — Delete an item
- **Goal:** remove something added by mistake or no longer needed.
- **Precondition:** signed in; the item exists.
- **Main flow:** User taps "Delete" on the item → System removes it permanently.
- **Outcome:** the item is gone from the List and all totals.

### UC-7 — Switch to a calmer view (light / dark theme)
- **Goal:** use whichever theme is easier on the eyes.
- **Precondition:** none.
- **Main flow:** User taps the theme toggle → System switches between light and dark.
- **Outcome:** the whole app re-themes immediately.

### UC-8 — Sign out
- **Goal:** end the session, e.g. on a shared device.
- **Precondition:** signed in.
- **Main flow:** User taps "Sign out" → System ends the session → User returns to the
  start / sign-in.
- **Outcome:** protected pages are no longer reachable until the user signs in again.

### UC-9 — Enter from the welcome screen
- **Goal:** start using the app from the landing page, whether I'm new or returning.
- **Precondition:** none.
- **Main flow:** User opens the landing page → if not signed in, sees "Get started" and
  "I already have an account" (both lead to sign-in); if already signed in, sees a single
  "Continue" button straight to Home.
- **Outcome:** the user reaches the right next step without a dead end.

### UC-10 — Confirm my sign-in status
- **Goal:** see whether I'm signed in and, if so, as which email.
- **Precondition:** none.
- **Main flow:** User opens the account page → System shows "Signed in as <email>" with a
  way into the app and a Sign out button, or "Not signed in" with a link to sign in.
- **Outcome:** the user always knows their status and how to proceed.

### UC-11 — Make a bill or task repeat
- **Goal:** set something up once that happens on a cycle (rent every month, a weekly
  chore), instead of re-adding it each time.
- **Precondition:** signed in; adding an item on The List.
- **Main flow:** User fills in an item → ticks **Repeats** → picks a frequency
  (day / week / month / year) → taps "Add to my list". Later, when the user checks the
  item off, the System moves its due date **forward by one cycle** and keeps it active,
  instead of marking it done forever.
- **Outcome:** repeating items stay on the List and roll to their next due date each time
  they're completed — no re-entry, no clutter.

---

## BDD scenarios (Built)

Written as **Given / When / Then**. Each maps to one or more use cases.

### Feature: Welcome / landing page (UC-9)

```gherkin
Scenario: A new visitor sees how to start
  Given I am not signed in
  When I open the landing page
  Then I see "Get started" and "I already have an account"
  And both take me to the sign-in page

Scenario: A returning, signed-in visitor can continue
  Given I already have an active session
  When I open the landing page
  Then I see a single "Continue" button
  And it takes me to the Home screen
```

### Feature: Passwordless sign-in (UC-1)

```gherkin
Scenario: Request a sign-in link
  Given I am not signed in
  And I am on the sign-in page
  When I enter my email address
  And I tap "Send me a link"
  Then I see a confirmation that a sign-in link was sent to my email

Scenario: The app remembers my email
  Given I signed in with my email on this device before
  When I return to the sign-in page
  Then my email address is already filled in
  And the heading greets me with "Welcome back"

Scenario: Completing sign-in from the link
  Given I requested a sign-in link
  When I click the link in my email
  Then the app creates my session
  And I land on the Home screen

Scenario: An invalid or missing link
  Given I open the sign-in callback without a valid code
  Then I am sent back to the sign-in page with an error

Scenario: Already signed in
  Given I already have an active session
  When I open the sign-in page
  Then I am taken straight to the Home screen
```

### Feature: Account status page (UC-10)

```gherkin
Scenario: Confirming I'm signed in
  Given I am signed in as "me@example.com"
  When I open the account page
  Then I see that I'm signed in as "me@example.com"
  And I can go to the app or sign out

Scenario: Seeing that I'm signed out
  Given I am not signed in
  When I open the account page
  Then I am told I don't have an active session
  And I am offered a link to sign in
```

### Feature: Protected pages (UC-1)

```gherkin
Scenario: Home requires sign-in
  Given I am not signed in
  When I try to open the Home screen
  Then I am redirected to the sign-in page

Scenario: The List requires sign-in
  Given I am not signed in
  When I try to open The List
  Then I am redirected to the sign-in page
```

### Feature: Safe-to-Spend on Home (UC-2, UC-3)

```gherkin
Scenario: Prompt to set up money
  Given I am signed in
  And I have not entered a balance yet
  When I open the Home screen
  Then I am asked to add my balance to see what's safe to spend

Scenario: Safe-to-Spend is balance minus unpaid bills
  Given my current balance is $1,000.00
  And I have an unpaid bill of $300.00
  When I open the Home screen
  Then Safe-to-Spend shows $700.00

Scenario: A gentle message when bills exceed balance
  Given my current balance is $200.00
  And I have unpaid bills totalling $500.00
  When I open the Home screen
  Then Safe-to-Spend shows -$300.00
  And I see a kind, shame-free message telling me to go gently

Scenario: Paid bills no longer reduce Safe-to-Spend
  Given my balance is $1,000.00
  And a $300.00 bill that I have marked as done
  When I open the Home screen
  Then Safe-to-Spend shows $1,000.00

Scenario: Monthly income is optional
  Given I am setting up my money
  When I enter a balance but leave monthly income blank
  And I save
  Then my balance is saved
  And Safe-to-Spend is calculated without requiring an income
```

### Feature: Your next thing on Home (UC-2)

```gherkin
Scenario: The soonest unpaid item is highlighted
  Given I have an unpaid bill due 2026-12-01
  And an unpaid task due 2026-11-20
  When I open the Home screen
  Then "Your next thing" shows the task due 2026-11-20

Scenario: Nothing left to do
  Given I have no unpaid items
  When I open the Home screen
  Then "Your next thing" tells me I'm all caught up
```

### Feature: The List — add, complete, delete (UC-4, UC-5, UC-6)

```gherkin
Scenario: Add a bill with an amount and due date
  Given I am on The List
  When I choose "Bill"
  And I enter the title "Electric"
  And I enter the amount 85
  And I set the due date 2026-11-25
  And I tap "Add to my list"
  Then "Electric" appears on my List tagged as a Bill, showing $85.00 and its due date

Scenario: Add a task without an amount
  Given I am on The List
  When I choose "Task"
  And I enter the title "Call the dentist"
  And I tap "Add to my list"
  Then "Call the dentist" appears on my List tagged as a Task with no amount

Scenario: The List is ordered soonest-due first
  Given I have items due on different dates
  When I view The List
  Then items are shown with the soonest due date first

Scenario: Can't add a blank item
  Given I am on The List
  And the title field is empty
  Then the "Add to my list" button is disabled

Scenario: Mark an item done
  Given "Electric" is on my List and not done
  When I tick its checkbox
  Then it shows as completed with a line through it

Scenario: Un-check an item (undo done)
  Given "Electric" is on my List and marked as done
  When I un-tick its checkbox
  Then it returns to active (no line through it)
  And it counts toward Safe-to-Spend and "your next thing" again

Scenario: Delete an item
  Given "Electric" is on my List
  When I tap "Delete" on it
  Then it is removed from my List
```

### Feature: Recurring items (UC-11)

```gherkin
Scenario: Add a monthly recurring bill
  Given I am on The List
  When I choose "Bill"
  And I enter the title "Rent"
  And I tick "Repeats"
  And I choose "Every month"
  And I tap "Add to my list"
  Then "Rent" appears on my List with a repeat badge showing "monthly"

Scenario: Completing a recurring item rolls it forward
  Given "Rent" is a monthly recurring bill due 2026-11-01
  When I tick its checkbox
  Then it does not stay crossed out as done
  And its due date moves forward to 2026-12-01
  And it remains active for next month

Scenario: A one-off item still just completes
  Given "Electric" is a bill that does not repeat
  When I tick its checkbox
  Then it shows as completed with a line through it
  And it does not roll forward
```

### Feature: Theme and sign-out (UC-7, UC-8)

```gherkin
Scenario: Theme follows my device by default
  Given I have not chosen a theme yet
  When I first open the app
  Then it matches my device's light or dark setting

Scenario: Switch theme
  Given I am using the app
  When I tap the theme toggle
  Then the app switches between light and dark

Scenario: Sign out
  Given I am signed in
  When I tap "Sign out"
  Then my session ends
  And I can no longer open the Home screen without signing in again
```

### Feature: Data privacy / isolation (cross-cutting)

```gherkin
Scenario: I only ever see my own data
  Given another person also uses Momentum
  When I view my List and my Home
  Then I see only the bills, tasks, and money that I created
  And never anyone else's
```

### Feature: Friendly error handling (cross-cutting)

```gherkin
Scenario: Loading my data fails gracefully
  Given I am signed in
  And my data cannot be loaded right now
  When I open Home or The List
  Then I see a calm error message instead of a broken screen

Scenario: Saving fails gracefully
  Given I am adding an item or saving my money
  When the save does not succeed
  Then I see a clear message that it didn't save
  And what I typed is not lost
```

---

## Planned (not yet built)

These are intended by the spec but **not** implemented in MVP #1. Listed so the
requirements stay honest and so they're ready to become future tickets.

- **Real reminders / notifications.** The database stores a `reminder_lead_days` value
  (default 3), but the app does not yet send reminders or nudges ahead of a due date.
- **Task "first step."** The `items` table has a `first_step` field (a visible first
  action for a task), not yet surfaced in the screens.
- **Display name / profile editing** beyond balance and income.

---

*Use this as the acceptance criteria for the Week 3 backlog ticket, and walk the
"Built" BDD scenarios by hand against the live app before you submit.*
