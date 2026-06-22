# create-modern-monorepo

Scaffold a batteries-included fullstack monorepo — a CRUD **web** app (TanStack Start),
**iOS** app (Expo), shared **shadcn/ui** design system, and a realtime **Convex** backend —
with one command.

```bash
bun create modern-monorepo my-app
cd my-app
bun dev
```

`bun dev` runs the web app at <http://localhost:3000> and builds + launches the iOS app in
the Simulator. That's it — no accounts required to start (Convex runs as an anonymous local
deployment).

## What you answer

Just the **project name** (taken from the positional argument, or prompted if omitted).
Everything else is derived:

| Input           | Derives                                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `my-app` (slug) | directory, root `package.json` name, `.code-workspace`, mobile `slug`/`scheme`, **display name** (`My App`), **bundle id** (`com.myapp`, hyphens stripped for Android) |

You're also asked (optionally) for a **Resend API key** so email sign-in works out of the box
— get one free at <https://resend.com/api-keys>, or press Enter to skip and add it later with:

```bash
cd packages/backend && bunx convex env set AUTH_RESEND_KEY <your-key>
```

## What it does

1. Copies a bundled snapshot of the monorepo template into `./my-app`.
2. Rewrites every identity value: the distinctive tokens (`Tasklit`, `fullstack-monorepo-template`,
   `com.aabuhijleh.mobile`) via scoped text replacement, and `app.json`'s `name`/`slug`/`scheme`/
   bundle id via structured JSON edits. Internal conventions (`@workspace/*` scope, `web`/`mobile`
   package names) are intentionally left intact.
3. `git init` + an initial commit.
4. Runs `setup.sh --no-prebuild`: installs deps, writes env files, and provisions Convex
   (anonymous local deployment + auth signing keys). The iOS native build is deferred to the
   first `bun dev` (which `expo run:ios` performs automatically).

Pass `--skip-setup` to scaffold the files only and run `./setup.sh` yourself.

## Requirements

- [Bun](https://bun.sh/)
- macOS with Xcode + a Simulator (for the iOS app — see the generated project's README)

## Maintainers — publishing

The CLI bundles a `template/` directory generated from the repo root at pack time:

- `bun run build:template` snapshots the repo (via `git ls-files`, so ignored/generated/secret
  files are excluded) into `template/`, renaming tracked `.gitignore` → `gitignore` (npm strips
  `.gitignore` from tarballs; the CLI restores it on scaffold) and excluding the scaffolder
  package itself.
- `prepack` runs `build:template` automatically, so:

```bash
cd packages/create-modern-monorepo
bun publish        # runs prepack -> build:template, then publishes
```

`template/` is gitignored; an `.npmignore` (present, intentionally empty of patterns) ensures it
still ships in the tarball, scoped by the `files` allowlist (`src` + `template`).
