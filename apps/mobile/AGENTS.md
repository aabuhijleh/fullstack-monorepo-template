# AGENTS.md — `mobile`

Guidance for the mobile app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: Expo.

## Conventions

- Follow the [Expo v56.0.0 docs](https://docs.expo.dev/versions/v56.0.0/) and invoke the relevant "expo" skill before writing code.
- Styling: Uniwind (Tailwind CSS 4 + CSS theming); invoke the "uniwind" skill first.
- Theme tokens live in `@workspace/ui`'s `theme.css` — don't fork them here.
- Routing: expo-router (file-based). Routes live under `src/app/`; shared non-route code under `src/` (imported via the `~/*` alias → `src/*`). Entry is a local `index.js` that imports `expo-router/entry`.
- Tests: **jest**; run `bun run test`.

## Monorepo constraints (don't break these)

Expo + bun in this monorepo requires specific settings to bundle and build natively:

- **Bun must use the hoisted linker** — `linker = "hoisted"` in the root `bunfig.toml`. Bun's default isolated layout breaks Metro/Expo.
- **One React version repo-wide** — `react` (and `react-dom`) pinned to exactly `19.2.3` across `mobile`, `web`, and `packages/ui` (matches Expo 56's bundled modules). Drift reintroduces duplicate-React failures.
- **`overrides` must live in the root `package.json`** — bun ignores `overrides` in workspace packages.
