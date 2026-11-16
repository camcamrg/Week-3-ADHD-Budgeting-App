---
name: ux-design
description: Use whenever I share a screenshot, mockup, or flow and want UX feedback, design critique, or a recommendation for a new design or feature. Also when I say "is this good UX," "review this design," "how should I design X," "using this design as a basis design X," or "review UX." Apply by default when building or editing any interface, flow, or feature, even when UX isn't explicitly mentioned. Not when I specifically want an accessibility check — use `accessible-design` for that.
---

# UX Design

## When reviewing a design
1. Check how the design handles each user state — empty, loading/skeleton, error/validation, high-density, and overflow.
2. Is the main objective obvious?
3. Is the flow efficient?
4. Are labels and copy clear?
5. Is it consistent with the design system?
6. Does the user get feedback when they act?
7. Is all the information relevant?
8. Is it designed to prevent errors?
9. Is there help documentation, and is it easy to find?
10. Send a message that points out where improvements are needed, along with recommendations.

## Always / Never
- Always use the project's design system and components.
- Always show loading, empty, error, and success states for anything that fetches or submits data.
- Never show a raw technical error (like "500"); always write a plain-language message that says what to do next.
- Always confirm destructive actions (delete, overwrite) before carrying them out.
- Always use sensible defaults — pre-fill what you can and ask for the least information necessary.

## Done when
- Every data-driven area shows loading, empty, error, and success states.
- Error messages are plain-language and say what to do next.
- Destructive actions require confirmation.
- The design uses the project's design system and components.
- Inputs use sensible defaults and ask only for what's needed.
