# AGENTS.md

This file provides guidance to AI coding assistants working in this project. Read it in full before making modifications.

**Self-maintaining:** After any meaningful change to the project (new conventions, architectural shifts, updated flows, gotchas found), update this file with concise edits to keep it accurate.

## Project Conventions

- Use only `bun` and `bunx` for all scripts and package management tasks; do not use `npm`, `yarn`, or `pnpm` under any circumstances.
- Always use Zod v4 for validation (schemas, environment variables, input checking) instead of manual type definitions. Prefer schema-based validation to ensure consistent, type-safe input handling across the codebase.
- For web, use shadcn/ui design system ("@workspace/ui" in "./packages/ui") before custom code.
- For mobile, use the expo v56.0.0 docs <https://docs.expo.dev/versions/v56.0.0/> before writing any code.
- For mobile, use Nativewind v5 for styling. Check the docs <https://www.nativewind.dev/v5/llms.txt> before writing styling code.
- For backend, check "./packages/backend/AGENTS.md" for important guidelines on how to correctly use Convex APIs and patterns.
- To verify changes, run `bun check` (or `bun fix` to auto-fix). Do not run `tsc` — oxlint is type-aware (`oxlint-tsgolint`) and handles typechecking and linting in one pass.

### Mobile styling gotchas (NativeWind v5 / react-native-css)

- `className` only works on components imported from `react-native` (View, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, etc.) — the polyfill swaps those imports to `react-native-css/components`. **Third-party components are not swapped:** `SafeAreaView`/`SafeAreaProvider` from `react-native-safe-area-context` silently ignore `className`. For those, either import from `react-native-css/components/react-native-safe-area-context` or style them with inline `style`, not `className`.
- `SafeAreaView` from `react-native-safe-area-context` has **no default `flex: 1`** (unlike the legacy RN one). Keep `flex-1` + background on a `className`-styled `<View>` and use `SafeAreaView` only for insets via inline `style={{ flex: 1 }}`. A missing `flex: 1` here collapses the view to content height, which clips descendant text and breaks vertical centering.
- Symptoms like invisible `<Text>`, washed-out colors, or top-aligned content are almost always a **broken flex/parent-height chain**, not a broken Tailwind pipeline. Tailwind v4 colors compile to `var(--color-*)` and `text-*` sizes carry em-relative line-heights; these resolve correctly on real RN components. To confirm the pipeline is fine, the runtime style registry is in the Metro bundle (`curl 'http://localhost:8081/apps/mobile/index.bundle?platform=ios&dev=true&minify=false'`).
- `bun run ios` builds a dev client that loads from the Metro dev server, so a JS-only change just needs a reload. Cache issues: `bunx expo start --clear`. Native/config changes: rebuild with `bun run ios:build`.
- **The native Stack header is NOT styled by NativeWind.** `dark:` classes only reach components you render; the header (title, `headerRight`, its background/border) is drawn by Expo Router's navigation layer and reads colors from a React Navigation `ThemeProvider` context. With no provider it falls back to the light default, so in dark mode the body goes dark but the header stays white. Fix: wrap the navigator in `<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>` in the root `app/_layout.tsx`, with `colorScheme` from `react-native`'s `useColorScheme()` (it reflects `Appearance.setColorScheme()`, which is what the theme toggle sets).
- **Expo Router 56 vendors React Navigation** — it is NOT a direct dependency and `@react-navigation/native` is not installed. Import `ThemeProvider`, `DarkTheme`, `DefaultTheme`, `useTheme` from `expo-router` itself, not from `@react-navigation/*`.
- The built-in `DarkTheme` header (`card`) is neutral `rgb(18,18,18)`, which is a hair off the app body's `dark:bg-gray-900` (`rgb(17,24,39)`, slightly navy). We accept this minor mismatch. To make the header pixel-match instead, spread a custom theme overriding `colors.card`/`background`/`text`/`border` with the Tailwind palette values.

## Git Workflow and PR Instructions

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
