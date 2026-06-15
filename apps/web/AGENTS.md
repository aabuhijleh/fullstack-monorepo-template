# AGENTS.md — `web`

Guidance for the web app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: TanStack Start in SPA mode.

## Conventions

- UI: use shadcn/ui from `@workspace/ui` before writing custom code; invoke the "shadcn" skill first.
- Theme tokens live in `@workspace/ui`'s `theme.css` — don't fork them here.
- Tests: **vitest** (with `@testing-library/react`); run `bun run test`.
