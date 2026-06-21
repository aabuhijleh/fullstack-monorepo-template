# 🧩 Fullstack Monorepo Template

A [Turborepo](https://turborepo.dev/) monorepo wiring a web app, a mobile app, a shared
design system, and a realtime backend — with conventions and AI-agent tooling baked in.

| Workspace          | Stack                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`         | [TanStack Start](https://tanstack.com/start/latest) ([SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)) |
| `apps/mobile`      | [Expo](https://docs.expo.dev/) (React Native)                                                                                           |
| `packages/ui`      | [shadcn/ui](https://ui.shadcn.com/) design system + shared theme tokens (web + mobile)                                                  |
| `packages/backend` | [Convex](https://www.convex.dev/) — schema, functions, auth                                                                             |

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) and [Node.js](https://nodejs.org/) >=24
- macOS with a configured [React Native iOS development environment](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=ios) (Xcode + CocoaPods + a Simulator)

> The macOS requirement is for the mobile `dev` script, which uses `expo run:ios` to build
> and run the app on an iOS Simulator. To develop on Android instead, switch it to
> `expo run:android` — see Expo's [local app compilation guide](https://docs.expo.dev/guides/local-app-development/#local-app-compilation).

### Setup

Run the setup script — it verifies your toolchain, installs deps + git hooks, writes the
local env files, provisions Convex, and prebuilds the iOS native project (idempotent, safe
to re-run):

```bash
./setup.sh        # or: bun run setup
```

Then start everything:

```bash
bun dev
```

`bun dev` opens the Turborepo terminal UI and runs these persistent tasks:

- **Backend** — `convex dev` starts and watches the Convex backend.
- **Web** — `vite dev` serves the TanStack Start app at <http://localhost:3000>.
- **Mobile** — `expo run:ios` compiles the iOS debug build, installs it in a Simulator, starts Metro, and opens the app.

> The **first** `bun dev` compiles the iOS app in Xcode (a few minutes). After that, builds
> are incremental: TypeScript changes use Fast Refresh; native dependency or app config
> changes require another native build.

## 🤖 AI Agents

This repo is set up for AI coding agents.

| File / Directory   | Purpose                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`        | [Agent instructions](https://agents.md), per package (symlinked to `CLAUDE.md`)                                |
| `.agents/skills/`  | [Agent skills](https://github.com/vercel-labs/skills#what-are-agent-skills) (symlinked into `.claude/skills/`) |
| `skills-lock.json` | [skills CLI](https://github.com/vercel-labs/skills) lockfile                                                   |
| `docs/agents/`     | Issue-tracker, triage, and domain conventions agents read before running                                       |
| `docs/adr/`        | Architecture Decision Records                                                                                  |

The root [`AGENTS.md`](AGENTS.md) is the repo-wide router; each package has its own
`AGENTS.md` with package-specific guidance.

> **🚢 Idea → ship pipeline:** `/grill-with-docs` → `/to-prd` → `/to-issues` → implementation.
> This is the recommended way to take a feature from a rough idea all the way to merged
> code — each step hands structured output to the next.

### Global CLI tools

Install these globally to give agents additional capabilities:

```bash
bun add -g skills opensrc ctx7
ctx7 login
```

- [skills](https://github.com/vercel-labs/skills) — install/restore agent skills (`skills experimental_install` restores the locked set)
- [opensrc](https://github.com/vercel-labs/opensrc) — fetch dependency source code for deeper context
- [context7](https://github.com/upstash/context7) — up-to-date library docs

## 🧩 Editor Setup

**VS Code** (or **Cursor**) is recommended. Open the workspace file, not the bare folder:

```bash
code fullstack-monorepo-template.code-workspace   # or: cursor …
```

It sets up diagnostics and format-on-save across every workspace.

## 🏷️ Releases

Releases run via [multi-semantic-release](https://github.com/qiwi/multi-semantic-release) on
every push to `main` (after the **Code Quality** workflow passes). It versions each workspace
independently from [Conventional Commits](https://www.conventionalcommits.org/), scoped to
the files each commit touched, and publishes a per-package GitHub Release + git tag
(`web@x.y.z`, `mobile@x.y.z`, `@workspace/ui@x.y.z`, `@workspace/backend@x.y.z`).

Shared config lives in [`release.config.base.cjs`](release.config.base.cjs); each workspace
re-exports it from its own `release.config.cjs`.
