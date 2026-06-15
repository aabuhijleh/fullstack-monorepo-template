# AGENTS.md — `@workspace/backend`

Guidance for the Convex backend. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

## Skills

Convex skills are scoped to this package (`.agents/skills`, tracked by `skills-lock.json`
here) and activate when you work in `packages/backend`. Invoke them with the Skill tool.
To add or remove a backend-scoped skill, run `bunx skills` from this directory.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
