#!/usr/bin/env bun
import { copyFile, lstat, mkdir, readlink, rm, symlink } from "node:fs/promises";
import path from "node:path";

/**
 * Snapshots the monorepo root into this package's `template/` directory.
 *
 * The snapshot is the set of files `git` considers part of the project
 * (tracked + new-untracked, excluding everything gitignored), minus the
 * scaffolder itself and lockfiles. It is what gets shipped inside the published
 * npm tarball and copied into a user's new project.
 *
 * Idempotent: safe to re-run; it wipes and rebuilds `template/` each time.
 */
import { $ } from "bun";

const thisPackageDir = path.resolve(import.meta.dir, "..");
const templateDir = path.join(thisPackageDir, "template");

// Paths (relative to repoRoot) that must never enter the snapshot.
const SCAFFOLDER_PREFIX = "packages/create-modern-monorepo/";

async function main() {
  const repoRoot = (await $`git rev-parse --show-toplevel`.text()).trim();
  if (!repoRoot) {
    throw new Error("could not resolve repo root via `git rev-parse --show-toplevel`");
  }

  // Fresh start so the snapshot never carries stale files.
  await rm(templateDir, { recursive: true, force: true });
  await mkdir(templateDir, { recursive: true });

  // Tracked + new-untracked files, excluding everything gitignored
  // (node_modules, ios/, android/, .convex/, .env*, .turbo, .expo, dist, …).
  const listing = await $`git ls-files --cached --others --exclude-standard`.cwd(repoRoot).text();

  const relPaths = listing
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((rel) => !rel.startsWith(SCAFFOLDER_PREFIX))
    .filter((rel) => path.basename(rel) !== "bun.lock");

  let written = 0;
  for (const rel of relPaths) {
    const src = path.join(repoRoot, rel);

    let stats;
    try {
      stats = await lstat(src);
    } catch {
      // git may list a path that no longer exists (e.g. just deleted); skip it.
      continue;
    }

    // npm strips the leading dot from `.gitignore` when packing, so store the
    // bundled copy as `gitignore`; the scaffolder's copy.ts restores it.
    const destRel =
      path.basename(rel) === ".gitignore" ? path.join(path.dirname(rel), "gitignore") : rel;
    const dest = path.join(templateDir, destRel);
    await mkdir(path.dirname(dest), { recursive: true });

    if (stats.isSymbolicLink()) {
      const linkTarget = await readlink(src);
      await symlink(linkTarget, dest);
      written += 1;
      continue;
    }
    if (stats.isFile()) {
      await copyFile(src, dest);
      written += 1;
    }
  }

  console.log(
    `build-template: wrote ${written} files into ${path.relative(process.cwd(), templateDir)}`,
  );
}

await main();
