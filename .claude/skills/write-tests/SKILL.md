---
name: write-tests
description: Use when I say "write tests for this," "add tests for," "run tests for," "add a test for this bug," "test this function," "make sure this is tested," or "do I have enough test coverage?"
---

# Write Tests

## Before you start
- Confirm which file or function to test.
- Confirm the expected behavior / success criteria — what counts as success, and what the error states are. If that's missing, ask me to clarify the intended behavior before writing tests.
- Identify the project's existing test framework and where tests live. If there's none, ask which to use.

## Steps
1. Maintain consistency by matching the existing framework and naming conventions.
2. Write comprehensive tests covering the happy path, edge cases, and error cases.
3. Run the tests.
4. Summarize the pass/fail metrics and any test coverage blind spots.

## Always / Never
- Always write a regression test for every bug.
- Always write independent and clearly named tests.
- Always test the happy path, edge cases, and error cases.
- Always test real behavior, not internal details.
- Never write a test that can't fail.
- Never couple tests together.
- Never skip the non-happy path.
- Never patch a bug without a test companion.

## Done when
- Tests cover the happy path, edge cases, and error cases.
- Any bug being fixed has a regression test that failed before the fix.
- All tests have been run and the pass/fail results reported.
- Tests are independent and clearly named.
- Coverage gaps are called out.
