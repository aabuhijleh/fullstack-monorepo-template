# AGENTS.md — `mobile`

Guidance for the mobile app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Self-maintaining: keep this file accurate with concise edits after meaningful changes.

## Conventions

- Follow the [Expo v56.0.0 docs](https://docs.expo.dev/versions/v56.0.0/) and invoke the relevant "expo" skill before writing code.
- Styling: Uniwind (Tailwind CSS 4 + CSS theming); invoke the "uniwind" skill first.
- Share styles via `theme.css` in the `@workspace/ui` package — don't fork theme tokens here.
- Expo Router: keep `src/app` route-only; colocate each screen's non-route code in `src/features/<feature>`.
- TanStack Query: use feature-owned `*.queries.ts` and `*.mutations.ts` factory objects with `queryOptions`/`mutationOptions`. Convex factories wrap `convexQuery` without replacing its adapter-owned keys.
- Optimistic UI: render pending mutation variables, using `useMutationState` when needed across components. Do not optimistically write to the TanStack or Convex cache.

## Skills

Expo, Uniwind, and React Native skills are scoped to this package
(`.agents/skills`, tracked by `skills-lock.json` here). They activate when you work in
`apps/mobile`. Invoke them with the Skill tool before writing code they cover. To add or
remove a mobile-scoped skill, run `bunx skills` from this directory.
