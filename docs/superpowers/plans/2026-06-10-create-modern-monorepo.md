# Create Modern Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and document the publishable `create-modern-monorepo` initializer invoked with `bun create modern-monorepo`.

**Architecture:** A focused workspace package owns validation, identity derivation, archive copying, file transforms, and the Clack entrypoint. A root setup-check script is included in every generated project and validates local environment readiness without printing secrets.

**Tech Stack:** Bun, TypeScript, `@clack/prompts`, Zod v4, Bun test runner, GitHub release archives.

---

### Task 1: Add CLI Package And Identity Derivation

**Files:**

- Create: `packages/create-modern-monorepo/package.json`
- Create: `packages/create-modern-monorepo/tsconfig.json`
- Create: `packages/create-modern-monorepo/src/identity.ts`
- Test: `packages/create-modern-monorepo/src/identity.test.ts`

- [ ] Write failing Bun tests asserting that `deriveIdentity("Acme Tasks")` returns package/slug `acme-tasks`, scheme `acmetasks`, and app ID `com.acmetasks.app`, while blank names and malformed app IDs fail Zod validation.
- [ ] Run `bun test packages/create-modern-monorepo/src/identity.test.ts` and confirm failure because the module does not exist.
- [ ] Implement Zod v4 schemas and deterministic derivation functions.
- [ ] Run the focused tests and confirm they pass.

### Task 2: Add Template Copy And Whitelabel Transforms

**Files:**

- Create: `packages/create-modern-monorepo/src/template.ts`
- Test: `packages/create-modern-monorepo/src/template.test.ts`

- [ ] Write failing tests using a temporary fixture tree that assert repository-only paths and the template lockfile are excluded, JSON identity fields are updated, asserted Tasklit strings are replaced, env examples are copied to local env files, and a stale placeholder causes generation to fail.
- [ ] Run the focused test and confirm failure because the generator does not exist.
- [ ] Implement archive-root discovery, filtered recursive copying, parsed JSON updates, asserted text replacements, and env-file creation.
- [ ] Run the focused tests and confirm they pass.

### Task 3: Add Setup Readiness Checker

**Files:**

- Create: `scripts/check-setup.ts`
- Test: `scripts/check-setup.test.ts`
- Modify: `package.json`

- [ ] Write failing tests for missing env files, invalid URLs, mismatched Convex URLs, and a locally ready configuration.
- [ ] Run `bun test scripts/check-setup.test.ts` and confirm failure because the checker does not exist.
- [ ] Implement exported pure local checks with Zod v4 plus a CLI that reports missing external Convex Auth and Resend deployment variables without printing values.
- [ ] Add `"setup": "bun scripts/check-setup.ts"` to the root scripts.
- [ ] Run the focused tests and confirm they pass.

### Task 4: Add Clack CLI Orchestration

**Files:**

- Create: `packages/create-modern-monorepo/src/cli.ts`
- Create: `packages/create-modern-monorepo/src/index.ts`
- Test: `packages/create-modern-monorepo/src/cli.test.ts`

- [ ] Write failing tests with injected prompts, downloader, command runner, and current directory. Assert required app-name prompting, default app ID, cancellation, non-empty directory refusal, automatic `bun install`, conditional `git init`, and cleanup after failure.
- [ ] Run the focused tests and confirm failure because orchestration does not exist.
- [ ] Implement the injectable workflow and the real `@clack/prompts` executable with intro, text prompts, validation, spinner tasks, cancel, and outro.
- [ ] Run the focused tests and confirm they pass.

### Task 5: Update Template Branding Contract And README

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `apps/web/src/routes/__root.tsx`
- Modify: `packages/create-modern-monorepo/src/template.ts`
- Test: `packages/create-modern-monorepo/src/template.test.ts`

- [ ] Add a failing transform test for a narrow generated-project README marker and generated app description.
- [ ] Run the focused test and confirm the new assertion fails.
- [ ] Add stable template markers, document `bun create modern-monorepo`, explain the exact interactive flow, list inferred identity fields, document Convex/Auth/Resend setup, `bun setup`, assets to replace, and maintainer publishing steps.
- [ ] Add a concise AGENTS.md rule requiring CLI identity manifests and setup docs to stay synchronized when branding/config surfaces change.
- [ ] Run the focused tests and confirm they pass.

### Task 6: Integrate, Pack, And Verify

**Files:**

- Modify: `bun.lock`
- Modify: any files required by formatter or focused fixes

- [ ] Run `bun install` to register the workspace package and dependencies.
- [ ] Run all CLI and setup tests with `bun test packages/create-modern-monorepo/src scripts/check-setup.test.ts`.
- [ ] Run `bun check:fix`.
- [ ] Run `bun test`.
- [ ] Run `bun --cwd packages/create-modern-monorepo pm pack`.
- [ ] Inspect the tarball contents and confirm the executable and source files required at runtime are included.
- [ ] Run an offline smoke generation from a local fixture archive into an empty temporary directory, then verify generated identity, env files, and `bun setup` behavior.
- [ ] Review `git diff` and ensure every change is scoped to the initializer and documentation.
