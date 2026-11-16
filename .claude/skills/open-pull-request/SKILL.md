---
name: open-pull-request
description: Use when I say "open a pull request," "put this up for review," "submit this for review," or "create a PR."
---

# Open Pull Request

## Before you start
- Create a branch and work on it, not on main.
- Run tests before committing.
- No secrets or junk in the changes.
- Keep changes focused.

## Steps
1. Commit changes with clear messages (what and why).
2. Push the branch.
3. Open the PR with a descriptive title and a description: what changed, why, and how to test it.
4. Request reviewers / link any related issue.

## Always / Never
- Always write clear commit messages (what and why).
- Always keep commits small and focused — one logical change each.
- Always report failed tests.
- Never commit directly to main.
- Never commit broken code or failing tests.
- Never commit secrets.

## Done when
- The change works and does what it claims.
- The code is readable, with clear names and clear commit messages.
- All tests pass.
- It's secure — no secrets, input validated.
- Changes are focused — nothing unrelated included.
- A message reporting the result has been sent.
