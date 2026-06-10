# Fullstack Monorepo Template

## Stack

- [Turborepo](https://turborepo.dev/)
- [TanStack Start](https://tanstack.com/start/latest) ([SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)) — `apps/web`
- [Expo](https://docs.expo.dev/) — `apps/mobile`
- [Convex](https://www.convex.dev/) — `packages/backend`
- [shadcn/ui](https://ui.shadcn.com/) — `packages/ui`

## Getting started

### Prerequisites

- [Bun](https://bun.sh/)
- [Node.js](https://nodejs.org/) >=24
- macOS with a configured [React Native iOS development environment](https://reactnative.dev/docs/set-up-your-environment?os=macos&platform=ios)

> Note: The macOS requirement is due to the mobile `dev` script, which uses `expo run:ios` to build and run the app on an iOS Simulator.
> If you'd prefer to use an Android device, you can change the script to `expo run:android`.
> For more information, see Expo’s [local app compilation guide](https://docs.expo.dev/guides/local-app-development/#local-app-compilation).

### Start development

```bash
bun install
bun dev
```

`bun dev` opens the Turborepo terminal UI and runs these persistent tasks:

- Backend: `convex dev` starts and watches the Convex backend.
- Web: `vite dev` Vite starts the TanStack Start app at <http://localhost:3000>.
- Mobile: `expo run:ios` compiles the native iOS debug build, installs it in an iOS Simulator, starts Metro, and opens the app.

The first iOS build can take several minutes. TypeScript changes use Fast Refresh; native dependency or app configuration changes require another native build.

## AI Agents

Ready for AI agents.

| File / Directory   | Purpose                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`        | [Agent instructions](https://agents.md) (symlinked to `CLAUDE.md`)                                             |
| `.agents/skills/`  | [Agent skills](https://github.com/vercel-labs/skills#what-are-agent-skills) (symlinked into `.claude/skills/`) |
| `skills-lock.json` | [skills CLI](https://github.com/vercel-labs/skills) lockfile                                                   |

### Global CLI Tools

Install these globally to give agents additional capabilities:

```bash
bun add -g skills opensrc ctx7
ctx7 login
```

- [skills](https://github.com/vercel-labs/skills)
- [opensrc](https://github.com/vercel-labs/opensrc)
- [context7](https://github.com/upstash/context7)
