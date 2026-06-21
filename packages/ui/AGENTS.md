# AGENTS.md — `@workspace/ui`

Guidance for the shared UI package. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: shadcn/ui based design system, managed by the shadcn CLI.

## Conventions

- `theme.css` holds the theme tokens shared by `web` and `mobile` — it is the single
  source of truth for styling. Change tokens here, not in the apps.
- Invoke the "shadcn" skill before adding or editing shadcn/ui components.

## Cross-platform alignment (web ↔ mobile)

`theme.css` is the shared layer; the React components are **web-only**.

- **Tokens are shared, components are not.** The `.tsx` components here are built on
  `@base-ui` / DOM primitives and render only on the web. `apps/web` imports them directly
  (`@workspace/ui/components/*`). `apps/mobile` **cannot** — React Native has no DOM. Mobile
  re-implements the same primitives with RN components + Uniwind classNames.
- **What mobile may import from this package:** `@workspace/ui/theme.css` (tokens) and
  platform-agnostic non-DOM helpers like `@workspace/ui/lib/utils` (`cn`). Never the components.
- **Shared design language** (keep web and its mobile twin in lockstep):
  - Same token names on both platforms — `bg-background`, `text-foreground`, `border-border`,
    `text-muted-foreground`, `font-heading`, etc. (Tailwind v4 on web, Uniwind on mobile, same
    classes). Don't hardcode colors/radii; if a value is missing, add a token here.
  - **Square corners** — the design uses no border radius (`rounded-none`) even though radius
    tokens exist. Don't introduce rounded corners on either platform.
  - **IBM Plex Sans** — `font-sans` for body, `font-heading` for the wordmark / headings /
    section labels. (Web loads it via `@fontsource`; mobile via `expo-font` — see
    `apps/mobile/AGENTS.md`.)
- **Maintaining parity:** a token change here flows to both apps automatically. When you
  change a **component's look** on web (e.g. `button.tsx` sizing/variants), mirror the relevant
  classes in mobile's RN re-implementation so the two stay visually aligned. New visual
  primitives go web-first as a shadcn component, then get a mobile twin.
