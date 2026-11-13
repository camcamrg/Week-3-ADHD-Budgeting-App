# Momentum — User Flows

Visual companions to [`use-cases-and-bdd.md`](./use-cases-and-bdd.md). Each flow is the
*map* of one feature's BDD scenarios: the paths a user takes and every decision point
(the yes/no forks). Diagrams are written in **Mermaid**, so they render automatically on
GitHub and in most Markdown previews.

How to read them: **rounded boxes** = where a flow starts or a key event happens,
**diamonds** = a decision, **rectangles** = a screen or action, **arrows** = what
happens next.

---

## Flow 1 — Passwordless sign-in

*Covers: "Passwordless sign-in" scenarios (UC-1).*

```mermaid
flowchart TD
    A([Open Momentum]) --> B{Already signed in?}
    B -- Yes --> H[Home screen]
    B -- No --> L[Sign-in page]
    L --> M{Email remembered<br/>on this device?}
    M -- Yes --> N["Email pre-filled<br/>Heading: Welcome back"]
    M -- No --> O["Empty email field<br/>Heading: Welcome"]
    N --> P[Enter / confirm email]
    O --> P
    P --> Q["Tap 'Send me a link'"]
    Q --> R["Confirmation: check your email"]
    R --> S([User clicks the magic link in their email])
    S --> T{Link has a valid code?}
    T -- Yes --> U[Create session] --> H
    T -- No --> V["Return to sign-in with an error"] --> L
```

---

## Flow 2 — Protected pages (access guard)

*Covers: "Protected pages" scenarios — Home and The List require sign-in.*

```mermaid
flowchart TD
    A([Open Home or The List]) --> B{Active session?}
    B -- Yes --> C[Show the page]
    B -- No --> D[Redirect to sign-in]
```

---

## Flow 3 — Home: Safe-to-Spend + your next thing

*Covers: "Safe-to-Spend on Home" and "Your next thing" scenarios (UC-2, UC-3).*

```mermaid
flowchart TD
    A([Open Home]) --> B{Balance set up?}
    B -- No --> C["Prompt: 'Set up my money'"]
    C --> D[Enter balance + optional income]
    D --> E[Save] --> F
    B -- Yes --> F["Safe-to-Spend = balance minus unpaid bills"]
    F --> G{"Safe-to-Spend >= 0 ?"}
    G -- Yes --> H["Show amount in the calm primary colour"]
    G -- No --> I["Show negative amount<br/>+ a gentle, shame-free message"]
    H --> NT{Any unpaid items?}
    I --> NT
    NT -- Yes --> K["'Your next thing' = soonest-due unpaid item"]
    NT -- No --> J["Message: you're all caught up"]
```

---

## Flow 4 — The List: add, complete, delete

*Covers: "The List" scenarios (UC-4, UC-5, UC-6).*

```mermaid
flowchart TD
    A([Open The List]) --> G{Signed in?}
    G -- No --> GL[Redirect to sign-in]
    G -- Yes --> B{Any items yet?}
    B -- No --> C["Empty state: add your first bill or task"]
    B -- Yes --> D["Show items, soonest-due first"]
    C --> E[Add-item form]
    D --> E
    E --> F{Bill or Task?}
    F -- Bill --> BH[Enter title + amount + optional due date]
    F -- Task --> TH[Enter title + optional due date]
    BH --> J{Title empty?}
    TH --> J
    J -- Yes --> K["'Add' button stays disabled"]
    J -- No --> L["Tap 'Add to my list'"]
    L --> M[Item saved, list reloads soonest-first]
    D --> N["Tick checkbox: mark done (strikethrough)"]
    D --> O["Tap 'Delete': item removed"]
```

---

## Flow 5 — Theme + sign out

*Covers: "Theme and sign-out" scenarios (UC-7, UC-8).*

```mermaid
flowchart TD
    A([Any screen]) --> B[Tap theme toggle]
    B --> C["App switches light <-> dark"]
    A --> D[Tap 'Sign out']
    D --> E[Session ends]
    E --> F["Protected pages redirect to sign-in"]
```

---

*These flows and the BDD scenarios describe the same behaviour from two angles — keep
them in sync when the app changes.*
