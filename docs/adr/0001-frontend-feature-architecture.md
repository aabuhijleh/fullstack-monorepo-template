---
status: accepted
---

# Frontend feature-based architecture with lint-enforced boundaries

Both frontend apps (`apps/web`, `apps/mobile`) organise `src/` into three tiers with a
unidirectional dependency flow — **shared → features → app** — roughly following
[bulletproof-react](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).
Features are strictly isolated (no feature may import another feature); cross-feature reuse
happens by promoting code to a shared layer or composing features in the app layer. The
boundaries are enforced in CI by oxlint.

## Layers

- **Shared** (`src/components`, `src/hooks`, `src/lib` (incl. `src/lib/utils`), `src/config`,
  `src/types`) — feature-agnostic. May import other shared layers only.
- **Features** (`src/features/<name>/`) — flat by default; promote to `components/`, `hooks/`,
  `utils/`, `types/` subfolders when a feature grows. May import shared layers and its own
  files (via **relative** imports). May **not** import other features or the app layer.
- **App** (`src/app/`) — the thin glue: routes, the router/providers, and app chrome. May
  import anything. The only place two features are composed together.
  - web: `src/app/routes` (TanStack Start `routesDirectory`), `src/app/router.tsx`,
    `src/app/components` (chrome). Configured in `apps/web/vite.config.ts`.
  - mobile: `src/app/` is the expo-router root (required by Expo).

## Enforcement (Model A)

oxlint does **not** implement ESLint's location-aware `import/no-restricted-paths` rule that
bulletproof uses. We enforce the same boundaries with `no-restricted-imports` scoped by
`overrides[].files` globs in `.oxlintrc.json`:

- Files in `features/**` and the shared layers may not import `~/features/**` or `~/app/**`.
- The app layer (`src/app/**`) is unrestricted.

Cross-feature isolation falls out automatically: any `~/features/X` import from inside a
feature is rejected regardless of `X`, so the rule can never be silently "forgotten" when a
new feature is added — and a feature referencing its own files uses relative imports instead.

## Considered options

- **Model A (chosen)** — two override blocks per app, plus the convention that intra-feature
  imports are relative. Zero per-feature maintenance; impossible to forget.
- **Model B (rejected)** — one `no-restricted-imports` block _per feature_ (mirroring
  bulletproof's per-zone config), which would let a feature use `~/features/<self>/…`
  absolute self-imports. Rejected because every new feature needs a new lint block — forget
  it and you get a silent hole — and it depends on negation globs oxlint may not support.

## Consequences

- Within a feature you import siblings by relative path (`./task-row`), not
  `~/features/tasks/task-row`. This is the one deviation from the repo's usual "prefer `~/`
  absolute" convention.
- Residual gap: because `no-restricted-imports` matches the import specifier (not the
  importer's location), a _deliberate_ relative cross-feature import (e.g. `../../auth/…`)
  is not caught. The common case — absolute `~/features/*` imports — is fully covered, and
  the existing ban on deep `../**` relatives covers most accidental escapes.
