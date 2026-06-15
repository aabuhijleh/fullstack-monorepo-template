# AGENTS.md — `@workspace/ui`

Guidance for the shared UI package. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: shadcn/ui based design system, managed by the shadcn CLI.

## Conventions

- `theme.css` holds the theme tokens shared by `web` and `mobile` — it is the single
  source of truth for styling. Change tokens here, not in the apps.
- Invoke the "shadcn" skill before adding or editing shadcn/ui components.
