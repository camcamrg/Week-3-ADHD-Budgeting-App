# ADR-0002: Use Vercel for hosting

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

Momentum needs to be hosted on a web server that's reachable on the internet,
always on, and not on my computer. Its code already lives on GitHub.

## Options considered

- **Vercel** — managed host: free, easily deployable, built for Next.js. _Con:_
  free-tier limits; tied to their platform.
- **Host it myself** — _Pro:_ full control and total ownership of the data. _Con:_
  must rent a server, install everything, and maintain it myself.

## Decision

We will use **Vercel**, because it was built to optimize Next.js and auto-deploys
from GitHub on every push — so Momentum runs smoothly with almost no server work.

## Consequences

- **Easier:** instant deploys, no server to manage.
- **Harder / trade-offs:** free-tier limits; tied to one platform (moving off later
  takes work).
- **Next steps:** connect the GitHub repo to Vercel (done).
