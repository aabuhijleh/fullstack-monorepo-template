# AGENTS.md

Guidance for AI coding assistants. CLAUDE.md is a symlink to this file.

Self-maintaining: keep these AGENTS.md files accurate with concise edits after meaningful changes.

This is the repo-wide router. It holds only conventions that apply everywhere.
Package-specific guidance lives in each package's own `AGENTS.md` — read it before
working in that package.

## Package Router

Read the package's own `AGENTS.md` before working in it:

- `apps/web` (`web`) — TanStack Start SPA client — [`apps/web/AGENTS.md`](./apps/web/AGENTS.md)
- `apps/mobile` (`mobile`) — Expo (React Native) client — [`apps/mobile/AGENTS.md`](./apps/mobile/AGENTS.md)
- `packages/ui` (`@workspace/ui`) — shared shadcn/ui design system + theme tokens (web + mobile) — [`packages/ui/AGENTS.md`](./packages/ui/AGENTS.md)
- `packages/backend` (`@workspace/backend`) — Convex backend: schema, functions, auth — [`packages/backend/AGENTS.md`](./packages/backend/AGENTS.md)

## Skills

Skills are discovered on-demand based on where you work in each package's directory. Invoke a skill with the Skill
tool before writing code it covers. Repo-wide skills apply everywhere; package-scoped
skills activate when you work in that package.

## Project Conventions

- Turborepo monorepo: apps in `apps/`, shared libraries in `packages/`; tasks run via `turbo`.
- Use only `bun`/`bunx` — never `npm`, `yarn`, or `pnpm`.
- Use Zod v4 for validating user input, environment variables, and external data sources, not manual types.
- Prefer inferring return types over explicitly annotating them.
- Verify with `bun check:fix` (auto-fixes lint/format) or `bun check` for a read-only pass. Don't run `tsc` — oxlint (`oxlint-tsgolint`) is type-aware and covers typechecking + linting.
- Run tests with `bun run test` (delegates to `turbo run test`). Frameworks differ by package: `web` and `backend` use **vitest**, `mobile` uses **jest**. See each package's `AGENTS.md`.

## Git Workflow Guidelines

- Use [conventional commits](https://www.conventionalcommits.org/) for PR titles and commit messages: `type(optional-scope): description`
- Allowed types: `feat`, `fix`, `perf`, `refactor`, `chore`, `build`, `ci`, `style`, `test`, `revert`, `docs`
- The description must start with a lowercase verb (e.g., `feat: add auth`, not `feat: Auth feature`).
- Branch naming: `type/short-description` (e.g., `feat/add-login-page`, `fix/query-cache-bug`)
- PR descriptions & commit messages must be concise
- PR template: ".github/pull_request_template.md"
- No AI attribution, never add "Generated with ...", "Co-authored-by: ...", etc. in PR descriptions or commit messages.
- Enable auto-merge if possible when creating a PR.
