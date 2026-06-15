# AGENTS.md — `web`

Guidance for the web app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Self-maintaining: keep this file accurate with concise edits after meaningful changes.

## Conventions

- UI: use shadcn/ui (`@workspace/ui` in `../../packages/ui`) before writing custom code; invoke the "shadcn" skill first.
- Share styles via `theme.css` in the `@workspace/ui` package — don't fork theme tokens here.
- TanStack Router: colocate route-owned components and data code in `-`-prefixed files/folders.
- TanStack Query: use feature-owned `*.queries.ts` and `*.mutations.ts` factory objects with `queryOptions`/`mutationOptions`. Convex factories wrap `convexQuery` without replacing its adapter-owned keys.
- Optimistic UI: render pending mutation variables, using `useMutationState` when needed across components. Do not optimistically write to the TanStack or Convex cache.

## Skills

The `shadcn` and `frontend-design` skills are shared and live at the repo root
(`../../.agents/skills`). Invoke them with the Skill tool when building UI.
