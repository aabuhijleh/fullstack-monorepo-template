# Fullstack Monorepo Template

Bun + Turborepo template.

## Stack

- `apps/api` — Hono on Cloudflare Workers
- `apps/web` — TanStack Start (React + Vite)
- `apps/mobile` — Expo (React Native)
- `packages/ui` — shared UI (Tailwind + Base UI)
- `packages/api-client` — typed Hono client

## Getting started

```bash
bun install
bun dev
```

## AI Agents

Ready for AI agent contributions.

| File / Directory | Purpose |
| --- | --- |
| `AGENTS.md` | [Agent instructions](https://agents.md) (symlinked to `CLAUDE.md`) |
| `.agents/skills/` | [Agent skills](https://github.com/vercel-labs/skills#what-are-agent-skills) (symlinked into `.claude/skills/`) |
| `skills-lock.json` | [skills CLI](https://github.com/vercel-labs/skills) lockfile |

### Global CLI Tools

Install these globally to give agents additional capabilities:

```bash
bun add -g skills opensrc ctx7
ctx7 login
```

- [skills](https://github.com/vercel-labs/skills)
- [opensrc](https://github.com/vercel-labs/opensrc)
- [context7](https://github.com/upstash/context7)
