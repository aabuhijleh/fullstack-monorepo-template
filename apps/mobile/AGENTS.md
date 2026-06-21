# AGENTS.md — `mobile`

Guidance for the mobile app. CLAUDE.md is a symlink to this file. See the root
[`AGENTS.md`](../../AGENTS.md) for repo-wide conventions, git workflow, and skills.

Stack: Expo.

## Architecture

Three tiers under `src/`, with a one-way dependency flow **shared → features → app**
(see [ADR 0001](../../docs/adr/0001-frontend-feature-architecture.md)). Boundaries are
enforced by oxlint — violations fail `bun check`.

| Layer        | Path                                                                                    | May import                                   | Holds                                                                                     |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Shared**   | `src/components`, `src/hooks`, `src/lib` (incl. `lib/utils`), `src/config`, `src/types` | other shared layers only                     | feature-agnostic UI, hooks, clients (convex/react-query/secure-storage/theme), env, types |
| **Features** | `src/features/<name>/`                                                                  | shared layers + own files (relative imports) | one self-contained feature; **never** another feature or `~/app`                          |
| **App**      | `src/app/`                                                                              | anything                                     | the expo-router root: route screens + layouts that wire features to paths                 |

Rules of thumb:

- Put new code in a **feature** by default; flat files until it grows, then promote to
  `components/`, `hooks/`, `utils/`, `types/` subfolders.
- A feature imports its own files with **relative** paths (`./task-row`), never
  `~/features/<self>/…`. Use `~/components`, `~/lib`, etc. for shared code.
- Need to share between two features? Promote the code to a shared layer, or compose both
  features in the **app** layer (the only place that may touch multiple features).
- `src/app/` is the expo-router root (required by Expo); a route file is thin — it typically
  re-exports a feature screen as its `default`.

## Conventions

- Follow the [Expo v56.0.0 docs](https://docs.expo.dev/versions/v56.0.0/) and invoke the relevant "expo" skill before writing code.
- Styling: Uniwind (Tailwind CSS 4 + CSS theming); invoke the "uniwind" skill first.
- Styling: always prefer the common theme tokens in `@workspace/ui`'s `theme.css` over custom values — don't fork or hardcode them here.
- **Visual parity with `web`** — mobile is a deliberate twin of the web UI. Use the same token
  classes (`bg-background`, `text-foreground`, `border-border`, `font-sans`/`font-heading`, …),
  keep **square corners** (`rounded-none` — no border radius anywhere), and use **IBM Plex
  Sans** (`font-sans` body, `font-heading` wordmark/headings/labels). When the web changes a
  shared look, mirror it here. Full rules: [`packages/ui/AGENTS.md`](../../packages/ui/AGENTS.md)
  → "Cross-platform alignment".
- **Using `@workspace/ui` from mobile** — import only `@workspace/ui/theme.css` (tokens, in
  `global.css`) and platform-agnostic helpers like `@workspace/ui/lib/utils` (`cn`). The UI
  package's React components are DOM/`@base-ui`-based and **do not render in React Native** —
  re-implement the primitive with RN components + Uniwind classNames that mirror the web
  component's classes (see `src/components/*` and the tasks feature for examples).
- Routing: expo-router (file-based). Routes live under `src/app/`; shared non-route code under `src/` (imported via the `~/*` alias → `src/*`). Entry is a local `index.js` that imports `expo-router/entry`.
- Tests: **jest**; run `bun run test`.

## Monorepo constraints (don't break these)

Expo + bun in this monorepo requires specific settings to bundle and build natively:

- **Bun must use the hoisted linker** — `linker = "hoisted"` in the root `bunfig.toml`. Bun's default isolated layout breaks Metro/Expo.
- **One React version repo-wide** — `react` (and `react-dom`) pinned to exactly `19.2.3` across `mobile`, `web`, and `packages/ui` (matches Expo 56's bundled modules). Drift reintroduces duplicate-React failures.
- **`overrides` must live in the root `package.json`** — bun ignores `overrides` in workspace packages.

## Native modules require a clean rebuild (not a Metro reload)

This app runs as a **compiled dev client**, not Expo Go, and uses **CNG** — `ios/` and
`android/` are gitignored and regenerated from config. So adding/removing/upgrading any
package with native code (anything with a config plugin or an iOS/Android module, e.g.
`expo-font`, `expo-secure-store`, `expo-camera`) is **not** picked up by a JS/Metro reload.
Skipping the rebuild produces a launch-time `dyld` `SIGABRT` — `Symbol not found … <Module>
→ ExpoModulesCore` — because the stale binary links the new module against an old
`ExpoModulesCore`.

After changing a native dependency, always:

```bash
bunx expo install <pkg>      # add/upgrade Expo pkgs with this — NEVER `bun add` (picks SDK-compatible versions)
bunx expo-doctor             # MUST be "no issues" — catches the traps below before you build
bunx expo prebuild --clean   # regenerate ios/android, re-autolink, fresh pod install
bun run dev                  # = expo run:ios — full native build + launch
```

Pure-JS dependency changes need only a Metro reload — the steps above apply only to native modules.

**The version-skew trap (this is what causes `Symbol not found … <Module> → ExpoModulesCore`).**
A native build may contain only **one** version of any native module. Two ways it breaks:

- **Different-version duplicate** — even `expo install` can resolve a native module (e.g.
  `expo-font`) to a version _newer_ than the one the installed Expo SDK bundles nested under
  `node_modules/expo/`. The two copies have incompatible Swift ABIs, so the module links
  against a symbol `ExpoModulesCore` doesn't export and aborts at launch. Fix: `bunx expo
install --fix` to realign the whole SDK to one consistent release.
- **Same-version duplicate** — repeated incremental `bun add` runs can leave several
  identical copies nested in `node_modules`. Fix: clean reinstall —
  `rm -rf node_modules apps/*/node_modules packages/*/node_modules && bun install`.

`bunx expo-doctor` reports both ("duplicate native module dependencies" / "packages should be
updated"). Treat a non-clean expo-doctor as a hard blocker — never `prebuild`/build on top of it.

- **Custom fonts are native** — load `.ttf` weights at runtime via `useFonts` in
  `app/_layout.tsx` (gated so render waits for them), and point Uniwind's `--font-*` tokens
  in `global.css` at the exact `useFonts` keys. The web's `@fontsource` (woff2) packages do
  **not** work on native. Adding a font family is a native change → rebuild per above.
