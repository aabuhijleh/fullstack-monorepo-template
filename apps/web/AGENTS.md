# AGENTS.md — `web`

Guidance for the web app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: TanStack Start in SPA mode.

## Conventions

- UI: always prefer our shadcn/ui design system components from `@workspace/ui` over creating custom ones; invoke the "shadcn" skill first. Only build custom components when no shadcn component fits.
- Styling: always prefer the common theme tokens in `@workspace/ui`'s `theme.css` over custom values — don't fork or hardcode them here.
- Tests: **vitest** (with `@testing-library/react`); run `bun run test`.
