# ADR-0001: Use Next.js with Material UI

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

Momentum is a three-tier progressive web app whose screens (tier 1) need to be
calm and accessible for people with ADHD (WCAG 2.2 AA). We needed a way to build
those screens, ideally one that could also hold our server code (tier 2) in the
same project, that runs on Vercel and is approachable for someone newer to coding.

### Framework (how to build the screens + server code)

- **Plain React** — _Pro:_ easy to use for local state and ticking timers. _Con:_
  needs a separate back end for server code.
- **Next.js** — _Pro:_ holds screens and server code in one project, deploys to
  Vercel easily. _Con:_ more complex to learn and operate.

### Design system (how to style the screens)

- **Scratch components** — _Pro:_ absolute design control; only use what you code.
  _Con:_ must manually meet accessibility standards and write custom inputs, modals,
  slider physics, etc.
- **Material UI** — _Pro:_ built to accessibility standards, and pre-built
  components mean fast assembly. _Con:_ harder to customize.

## Decision

We will use **Next.js** as our framework, because it holds our screens and server
code in one Vercel-ready project — removing engineering bottlenecks and keeping the
build simple enough to actually finish, which matters for a newer coder and an
ADHD-friendly product.

We will use **Material UI** with a warm "dopamine UX" theme, because its accessible,
pre-built components let us ship fast while stimulating focus and reducing
task-avoidance for the people we're building for.

## Consequences

- **Easier:** fast to build accessible screens, full-stack flexibility (screens +
  server code in one project), and the theme controls the whole look.
- **Harder / trade-offs:** Next.js has more to learn; Material UI is harder to deeply
  customize; the theme file needs a special `"use client"` line; and we have to work
  to keep the design from looking too corporate.
- **Next steps:** set up the MUI theme and provider (done), and keep all colours in
  the theme rather than hardcoded in components.
