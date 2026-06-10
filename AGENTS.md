# AGENTS.md

Guidance for AI coding assistants. CLAUDE.md is a symlink to this file.

**Self-maintaining:** keep this file accurate with concise edits after meaningful changes.

## Project Conventions

- Use only `bun`/`bunx` — never `npm`, `yarn`, or `pnpm`.
- Use Zod v4 for validating user input, environment variables, and external data sources, not manual types.
- Prefer inferring return types over explicitly annotating them.
- Web: use shadcn/ui (`@workspace/ui` in `./packages/ui`) before custom code; invoke the "shadcn" skill first.
- Mobile: follow the [expo v56.0.0 docs](https://docs.expo.dev/versions/v56.0.0/) and invoke the relevant "expo" skill before writing code.
- Mobile styling: Uniwind (Tailwind CSS 4 + CSS theming); invoke the "uniwind" skill first.
- Backend: see `./packages/backend/AGENTS.md` for Convex guidelines.
- TanStack Router: colocate route-owned components and data code in `-`-prefixed files/folders.
- Expo Router: keep `src/app` route-only; colocate each screen's non-route code in `src/features/<feature>`.
- TanStack Query: use feature-owned `*.queries.ts` and `*.mutations.ts` factory objects with `queryOptions`/`mutationOptions`. Convex factories wrap `convexQuery` without replacing its adapter-owned keys.
- Optimistic UI: render pending mutation variables, using `useMutationState` when needed across components. Do not optimistically write to the TanStack or Convex cache.
- Verify with `bun check:fix` (auto-fixes lint/format) or `bun check` for a read-only pass. Don't run `tsc` — oxlint (`oxlint-tsgolint`) is type-aware and covers typechecking + linting.

## Git Workflow Guidelines

- Use [conventional commits](https://www.conventionalcommits.org/) for PR titles and commit messages: `type(optional-scope): description`
- Allowed types: `feat`, `fix`, `perf`, `refactor`, `chore`, `build`, `ci`, `style`, `test`, `revert`, `docs`
- The description must start with a lowercase verb (e.g., `feat: add auth`, not `feat: Auth feature`).
- Branch naming: `type/short-description` (e.g., `feat/add-login-page`, `fix/query-cache-bug`)
- PR descriptions & commit messages must be concise
- PR template: ".github/pull_request_template.md"
- No AI attribution, never add "Generated with ...", "Co-authored-by: ...", etc. in PR descriptions or commit messages.
- Enable auto-merge if possible when creating a PR.

## Behavioral Guidelines

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.
