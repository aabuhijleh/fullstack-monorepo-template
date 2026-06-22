import { lstat, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { type ProjectIdentity } from "./derive.ts";

/** The three DISTINCTIVE source tokens that are safe for broad text replacement.
 *  The generic word "mobile" is deliberately NOT here — it appears everywhere
 *  legitimately and must never be globally replaced. */
const TEXT_TOKENS = ["Tasklit", "fullstack-monorepo-template", "com.aabuhijleh.mobile"] as const;

/** Binary file extensions to skip during the global text replace. */
const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".icns",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".keystore",
  ".jks",
  ".jar",
  ".p8",
  ".p12",
  ".key",
  ".mobileprovision",
  ".lock",
]);

/** Directories never walked during rewriting. */
const SKIP_DIRS = new Set([".git", "node_modules"]);

/** Rewrite a freshly-copied template in place so it carries the new project's
 *  identity. Order matters:
 *    1. global text replace of the distinctive tokens across all text files,
 *    2. structured edit of apps/mobile/app.json (authoritative for Expo ids),
 *    3. rename the *.code-workspace file to match the slug.
 */
export async function rewriteProject(targetDir: string, id: ProjectIdentity) {
  await globalTextReplace(targetDir, id);
  await rewriteAppJson(targetDir, id);
  await renameWorkspaceFile(targetDir, id);
}

// ---------- (1) global text replace ----------

async function globalTextReplace(targetDir: string, id: ProjectIdentity) {
  const replacements: ReadonlyArray<readonly [string, string]> = [
    ["Tasklit", id.displayName],
    ["fullstack-monorepo-template", id.slug],
    ["com.aabuhijleh.mobile", id.bundleId],
  ];

  await walkFiles(targetDir, async (filePath) => {
    if (BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase())) return;

    const buffer = await readFile(filePath);
    if (isLikelyBinary(buffer)) return;

    const original = buffer.toString("utf8");
    if (!TEXT_TOKENS.some((token) => original.includes(token))) return;

    let next = original;
    for (const [from, to] of replacements) {
      next = next.split(from).join(to);
    }
    if (next !== original) {
      await writeFile(filePath, next);
    }
  });
}

/** A file is treated as binary if any byte in its leading window is NUL. */
function isLikelyBinary(buffer: Buffer) {
  const window = Math.min(buffer.length, 8000);
  for (let i = 0; i < window; i += 1) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

/** Depth-first walk of every regular file under `dir`, skipping symlinks and
 *  the directories in SKIP_DIRS. */
async function walkFiles(dir: string, visit: (filePath: string) => Promise<void>) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walkFiles(full, visit);
      continue;
    }
    if (entry.isFile()) {
      await visit(full);
    }
  }
}

// ---------- (2) structured app.json edit ----------

async function rewriteAppJson(targetDir: string, id: ProjectIdentity) {
  const appJsonPath = path.join(targetDir, "apps", "mobile", "app.json");
  let raw: string;
  try {
    raw = await readFile(appJsonPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }

  const parsed = JSON.parse(raw) as {
    expo?: {
      name?: string;
      slug?: string;
      scheme?: string;
      ios?: { bundleIdentifier?: string };
      android?: { package?: string };
    };
  };

  const expo = (parsed.expo ??= {});
  expo.name = id.displayName;
  expo.slug = id.slug;
  expo.scheme = id.scheme;
  (expo.ios ??= {}).bundleIdentifier = id.bundleId;
  (expo.android ??= {}).package = id.bundleId;

  await writeFile(appJsonPath, `${JSON.stringify(parsed, null, 2)}\n`);
}

// ---------- (3) workspace file rename ----------

async function renameWorkspaceFile(targetDir: string, id: ProjectIdentity) {
  const from = path.join(targetDir, "fullstack-monorepo-template.code-workspace");
  const to = path.join(targetDir, `${id.slug}.code-workspace`);
  try {
    await lstat(from);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  await rename(from, to);
}
