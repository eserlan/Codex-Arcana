---
name: modern-css-2026
description: Guide for using native CSS Baseline 2026 features (if(), anchor positioning, scroll animations, style queries) to replace heavy JavaScript patterns. Use when users ask for layouts, tooltips, scroll effects, or theming.
---

# Modern CSS 2026

This skill helps you implement modern UI patterns using native CSS features standard in 2026, avoiding unnecessary JavaScript dependencies.

## Core Philosophy

**CSS First, JS Second.**
If a layout or animation state can be handled by the browser's style engine, do not use JavaScript main-thread logic.

## Capabilities Overview

1.  **Conditional Logic (`if()`)**: Inline property values based on conditions.
2.  **Anchor Positioning**: Popovers/tooltips linked to elements without DOM nesting.
3.  **Scroll-Driven Animations**: Parallax and scroll-linked effects on the compositor thread.
4.  **Style Queries (`@container`)**: Component styling based on parent property values.
5.  **Type-Safe Variables (`@property`)**: Animatable custom properties.

## When to Use This Skill

Trigger this skill when the user requests:
-   **"Position a tooltip/dropdown..."** -> Use Anchor Positioning (not Popper.js).
-   **"Animate this on scroll..."** -> Use Scroll-Driven Animations (not ScrollTrigger).
-   **"Theme styling/Dark mode logic..."** -> Use `if()` and Style Queries.
-   **"Animate a gradient..."** -> Use `@property`.

## Implementation Guide

### 1. Syntax & Examples
For detailed syntax and code snippets for all features, see:
[references/syntax-guide.md](references/syntax-guide.md)

### 2. Migration Patterns
For translating common JS patterns (like `window.onscroll` or `getBoundingClientRect`) to modern CSS:
[references/migration-guide.md](references/migration-guide.md)

### 3. Verification
Ensure the user has not explicitly requested legacy browser support (IE11, pre-2024 Safari). These features are Baseline 2026.

## Demo Asset
A full working example combining these features is available in:
[assets/demo-component.html](assets/demo-component.html)