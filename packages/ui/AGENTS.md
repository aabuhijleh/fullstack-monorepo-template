# AGENTS.md — `@workspace/ui`

Guidance for the shared UI package. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Self-maintaining: keep this file accurate with concise edits after meaningful changes.

## Conventions

- This package owns the shared shadcn/ui components consumed by `web` and `mobile`. Add or update components here before duplicating them in an app; invoke the "shadcn" skill first.
- Theme tokens live in `theme.css` and are the single source of truth for both web and mobile styling — change them here, not in the apps.

## Skills

The `shadcn` and `frontend-design` skills are shared and live at the repo root
(`../../.agents/skills`). Invoke them with the Skill tool when building components.
