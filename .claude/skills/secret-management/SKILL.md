---
name: secret-management
description: Use when writing or reviewing code that handles passwords, authentication, API keys, tokens, or credentials — including setting up environment variables, config files, or connecting to a database or outside service.
---

# Secret Management

## Before you start
- Confirm which project to set up secrets in. Default to the project currently open.
- Ask which secret keys to include (e.g., API_KEY, DATABASE_URL).
- If none are given, ask — or start with an empty template.

## Steps
1. Check for `.gitignore`. Make sure `.env` is listed inside it. If the file exists, add the line (don't replace its contents). If there is no `.gitignore`, create one.
2. Check whether `.env` is already tracked by Git; if it is, warn the user it may already be exposed.
3. Check for a `.env` file. If it doesn't exist, create one with the chosen keys. If it already exists, never overwrite it.
4. Create a file called `.env.example` with key names but blank/placeholder values (e.g. API_KEY=).

## Always / Never
- Always read secrets from environment variables / the `.env` file.
- Never paste a secret directly into the code.
- Never commit `.env` to Git.
- Never print or log a secret's actual value.
- If a secret gets exposed, treat it as compromised and replace it.

## Done when
- `.env` is listed in `.gitignore`.
- A `.env.example` exists with placeholder keys (no real values).
- No real secrets appear in any file tracked by Git.
