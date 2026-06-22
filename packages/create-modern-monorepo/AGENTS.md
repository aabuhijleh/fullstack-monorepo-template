# AGENTS.md — `create-modern-monorepo`

Guidance for the scaffolder package. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions.

The published npm package (`bun create modern-monorepo my-app`) that scaffolds a new copy of
**this very monorepo**, with all identity values rewritten. It is **excluded from the template
snapshot** (so scaffolded projects never contain it).

## Layout

| Path                        | Role                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`              | the `bin`. Orchestrates: parse args → prompt (slug, Resend key) → copy → rewrite → `git init` → `setup.sh --no-prebuild`. |
| `src/derive.ts`             | pure: `validateSlug` + `deriveIdentity` (slug → display name, scheme, hyphen-stripped bundle id).                         |
| `src/copy.ts`               | recursive template copy; recreates symlinks; restores `gitignore` → `.gitignore`.                                         |
| `src/rewrite.ts`            | scoped global text-replace of the 3 distinctive tokens + structured `app.json` edit + `.code-workspace` rename.           |
| `scripts/build-template.ts` | snapshots the repo root → `template/` (gitignored, generated).                                                            |
| `template/`                 | generated bundle (gitignored). Do not edit by hand — edit the repo and rebuild.                                           |

## How it works (the two non-obvious bits)

- **Template = the repo, snapshotted at pack time.** `build-template.ts` uses
  `git ls-files --cached --others --exclude-standard`, so node_modules, `ios/`, `android/`,
  `.convex/`, `.env*`, build output, and secrets are excluded by the existing ignore rules.
  The scaffolder package and `bun.lock` are filtered out explicitly. To change what ships,
  change the repo (or the filter), then `bun run build:template`.
- **Token rewrite is a hybrid.** The 3 _distinctive_ tokens (`Tasklit`,
  `fullstack-monorepo-template`, `com.aabuhijleh.mobile`) are safe for broad text replacement.
  The _generic_ values (`app.json`'s `slug`/`scheme` = `"mobile"`) are only ever touched via
  structured JSON edits — **never** text-replace the bare word `mobile`/`web`.

## Conventions

- bun-native ESM TypeScript; the `bin` runs under bun with no build step.
- Tests: `bun test ./src` (scoped to `src/` so it doesn't pick up the bundled `template/`'s tests).
- Verify with `bun check` from the repo root. `template/` is gitignored, so oxlint skips it.

## Gotchas

- **`bun.lock` cannot ship** — npm/bun pack strips lock files; the scaffold's `bun install`
  regenerates one. Don't rely on shipping it.
- **`convex env get JWKS` always exits 0** and prints the value (empty if unset) — presence is
  decided by non-empty stdout, not exit code (see `packages/backend/scripts/setup-auth-env.ts`).
- **`.npmignore` must contain no patterns** — bare patterns like `scripts/`/`tsconfig.json`
  would also strip them from inside `template/`. The `files` allowlist already scopes the tarball.
