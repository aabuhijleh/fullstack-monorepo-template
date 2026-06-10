# Create Modern Monorepo CLI

**Date:** 2026-06-10
**Status:** Approved direction, pending written-spec review

## Goal

Publish an npm initializer named `create-modern-monorepo`, invoked with:

```bash
bun create modern-monorepo my-app
```

It creates a new copy of this full-stack template, keeps the Tasklit task manager
as the working example, replaces template-specific identity, prepares local
environment files, and gives the user one explicit path to a working `bun dev`.

## User Experience

The CLI accepts an optional destination argument and otherwise prompts for it.
It then prompts for:

- app display name, defaulting from the destination name;
- package/repository name;
- Expo slug;
- Expo URL scheme;
- iOS bundle identifier;
- Android package name;
- whether to install dependencies;
- whether to initialize a Git repository.

Derived values are shown before files are written. All input is validated with
Zod v4. Package names, slugs, schemes, and native identifiers get separate
validation because their allowed formats differ.

The generator refuses a non-empty destination unless an explicit future
`--overwrite` option is added. This first version will not provide that option.

## Architecture

Add a publishable workspace package at `packages/create-modern-monorepo`. Its
package name and executable are both `create-modern-monorepo`.

The published CLI downloads the matching tagged GitHub source archive. The CLI
package version and template release tag use the same version, so generation is
reproducible and does not silently follow `main`.

Generation has five stages:

1. Validate arguments and prompt for missing identity values.
2. Download and extract the matching template archive into a temporary folder.
3. Copy the template into the destination while excluding repository-only
   content, including the CLI workspace itself, `.git`, caches, local env files,
   design documents, and the template's lockfile.
4. Apply identity changes through an explicit file manifest.
5. Create local env files from examples, optionally run `bun install`, optionally
   run `git init`, and print setup status.

Partial output is removed when generation fails before completion. Existing
user directories are never deleted.

## Identity Manifest

The generator updates only known fields:

| File                                          | Fields                                                     |
| --------------------------------------------- | ---------------------------------------------------------- |
| `package.json`                                | root package name                                          |
| `apps/mobile/app.json`                        | display name, slug, scheme, iOS bundle ID, Android package |
| `apps/web/public/manifest.json`               | display name and short name                                |
| `apps/web/src/lib/generate-metadata.ts`       | default title and title template                           |
| `apps/web/src/routes/__root.tsx`              | title and default description                              |
| `apps/web/src/lib/generate-metadata.test.tsx` | generated brand expectations                               |
| `README.md`                                   | generated project heading and setup instructions           |

JSON files are modified through parsed objects, not textual replacement.
Brand-bearing TypeScript files use narrow, asserted placeholders. Generation
fails if an expected placeholder is missing, preventing silently incomplete
whitelabeling when the template evolves.

When dependency installation is selected, `bun install` creates a fresh
`bun.lock`. With `--no-install`, no lockfile is emitted; the first later
`bun install` creates one with the generated package identity.

Task UI, backend schema, authentication, theming, shared UI, and branded image
assets remain as the demo implementation. The README explicitly lists image
assets as optional manual replacements because the CLI will not generate logos.

## Environment Setup

The generated project includes:

- `apps/web/.env`, copied from `apps/web/.env.example`;
- `apps/mobile/.env`, copied from `apps/mobile/.env.example`;
- `packages/backend/.env.local`, copied from
  `packages/backend/.env.example`;
- a root `bun setup` command that reports setup state without exposing secret
  values.

`bun setup` validates:

- local env files exist;
- web and mobile Convex URLs are valid and match the backend deployment URL;
- `VITE_APP_BASE_URL` is valid;
- Convex deployment and site URLs are present;
- Convex Auth keys are configured in the deployment;
- `SITE_URL` and `AUTH_RESEND_KEY` are configured in the deployment.

Local placeholder files alone do not make external services ready. The command
prints the exact next command for each missing step:

1. authenticate and create/select a Convex deployment;
2. initialize Convex Auth;
3. configure the Resend key;
4. synchronize the generated Convex URLs into web and mobile env files;
5. rerun `bun setup`;
6. run `bun dev`.

The setup checker reads local files and uses documented Convex CLI commands for
deployment environment inspection. It never prints secret values.

## README

The template README becomes both the package landing page and generated-project
guide. It will contain:

- the one-line create command;
- prerequisites;
- all CLI prompts and non-interactive flags;
- the generated identity fields and files;
- the external Convex, Convex Auth, and Resend setup sequence;
- `bun setup` as the readiness check;
- `bun dev` only after the readiness check passes;
- manual logo/favicon/OG-image replacement paths;
- local CLI development and publishing instructions for maintainers.

Generated projects retain the usage sections but omit CLI maintainer and
publishing sections.

## CLI Options

The first release supports:

```text
create-modern-monorepo [directory]
  --name <display-name>
  --package-name <package-name>
  --slug <expo-slug>
  --scheme <url-scheme>
  --ios-bundle-id <identifier>
  --android-package <identifier>
  --install / --no-install
  --git / --no-git
  --yes
  --help
  --version
```

`--yes` accepts derived defaults and is suitable for smoke tests. No package
manager choice is offered; generated projects use Bun exclusively.

## Testing

Tests use temporary directories and local fixture archives so they do not depend
on GitHub or npm.

Coverage includes:

- argument and identifier validation;
- default derivation;
- refusal of non-empty destinations;
- exclusion of repository-only files;
- every identity transformation;
- env-file creation;
- setup-checker missing, invalid, mismatched, and ready states;
- cleanup after a failed generation;
- `--yes --no-install --no-git` end-to-end generation.

Release verification additionally packs the CLI, installs the tarball into an
isolated temporary environment, generates a project, runs `bun install`, then
runs `bun check` and the generated project's tests.

## Release

Publishing is explicit and manual for the first release:

1. run repository checks and CLI integration tests;
2. create a matching version tag;
3. publish `packages/create-modern-monorepo` to npm;
4. verify `bun create modern-monorepo smoke-app --yes` against the published
   package.

Automated npm trusted publishing can be added after the first release proves the
package and tag contract.

## Out Of Scope

- Removing or replacing the Tasklit demo feature.
- Creating Convex, Resend, Apple, or Google accounts.
- Generating production logos or store artwork.
- Deploying web, mobile, or backend applications.
- Supporting npm, pnpm, or Yarn in generated projects.
