# AGENTS.md — `web`

Guidance for the web app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: TanStack Start in SPA mode.

## Architecture

Three tiers under `src/`, with a one-way dependency flow **shared → features → app**
(see [ADR 0001](../../docs/adr/0001-frontend-feature-architecture.md)). Boundaries are
enforced by oxlint — violations fail `bun check`.

| Layer        | Path                                                                                    | May import                                   | Holds                                                                       |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| **Shared**   | `src/components`, `src/hooks`, `src/lib` (incl. `lib/utils`), `src/config`, `src/types` | other shared layers only                     | feature-agnostic UI, hooks, clients, env, types                             |
| **Features** | `src/features/<name>/`                                                                  | shared layers + own files (relative imports) | one self-contained feature; **never** another feature or `~/app`            |
| **App**      | `src/app/`                                                                              | anything                                     | thin routes (`app/routes`), `app/router.tsx`, app chrome (`app/components`) |

Rules of thumb:

- Put new code in a **feature** by default; flat files until it grows, then promote to
  `components/`, `hooks/`, `utils/`, `types/` subfolders.
- A feature imports its own files with **relative** paths (`./task-row`), never
  `~/features/<self>/…`. Use `~/components`, `~/lib`, etc. for shared code.
- Need to share between two features? Promote the code to a shared layer, or compose both
  features in the **app** layer (the only place that may touch multiple features).
- Routes are thin: they wire a feature's exported screen/page to a path. Route generation is
  pointed at `src/app/routes` via `router` options in `vite.config.ts`.

## Conventions

- UI: always prefer our shadcn/ui design system components from `@workspace/ui` over creating custom ones; invoke the "shadcn" skill first. Only build custom components when no shadcn component fits.
- Styling: always prefer the common theme tokens in `@workspace/ui`'s `theme.css` over custom values — don't fork or hardcode them here.
- Tests: **vitest** (with `@testing-library/react`); run `bun run test`.
