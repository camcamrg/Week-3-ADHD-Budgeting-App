---
name: accessible-design
description: Use when building, editing, or reviewing any user interface — web pages, forms, buttons, menus, navigation, images, color or typography choices — or when asked whether something is accessible or how it can be made accessible. Apply by default to all UI work, even when accessibility isn't explicitly mentioned.
---

# Accessible Design

## Always / Never
- Always add alt text to images, describing the image — unless it's purely decorative, which gets empty alt text.
- Always ensure keyboard access (Tab to move, Enter/Space to activate), with a visible focus indicator showing what's selected. Never strip that outline.
- Always use the real element for the job — `<button>` for buttons, `<nav>` for navigation, headings in order. Never fake a button out of a plain `<div>`.
- Always add labels to form fields, so a screen reader can say "Email, text field" instead of just "text field."
- Always ensure text meets at least a 4.5:1 contrast ratio against its background. Never use color alone to signal something (like a red border for an error) — pair it with text or an icon.
- Always use WCAG Level AA as the benchmark.

## Done when
- Every image has alt text (or empty alt if decorative).
- All interactive elements work by keyboard, with a visible focus indicator.
- Real semantic elements are used (buttons, nav, headings in order) — no fake-button divs.
- Every form field has a label tied to it.
- Text meets 4.5:1 contrast, and no meaning is conveyed by color alone.
- The interface meets WCAG Level AA.
