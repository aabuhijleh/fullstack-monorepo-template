import { copyFile, lstat, mkdir, readdir, readlink, symlink } from "node:fs/promises";
import path from "node:path";

/** Recursively copy `templateDir` into `targetDir`.
 *
 * Behaviour mandated by the scaffolder:
 *  - SYMLINKS are recreated (not dereferenced), preserving their relative target.
 *  - DIRECTORIES are created and recursed into.
 *  - REGULAR FILES are copied byte-for-byte (preserving mode); a file whose
 *    basename is exactly `gitignore` is restored to `.gitignore` at the
 *    destination (npm strips the leading dot when packing, so the bundled
 *    template stores it without one).
 *
 * Defensive: throws if `targetDir` already exists and is non-empty.
 */
export async function copyTemplate(templateDir: string, targetDir: string) {
  await assertEmptyOrMissing(targetDir);
  await mkdir(targetDir, { recursive: true });
  await copyInto(templateDir, targetDir);
}

async function assertEmptyOrMissing(dir: string) {
  let entries: Array<string>;
  try {
    entries = await readdir(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  if (entries.length > 0) {
    throw new Error(`Target directory "${dir}" already exists and is not empty`);
  }
}

async function copyInto(srcDir: string, destDir: string) {
  const entries = await readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcDir, entry.name);
    const destName = entry.name === "gitignore" ? ".gitignore" : entry.name;
    const dest = path.join(destDir, destName);

    const stats = await lstat(src);
    if (stats.isSymbolicLink()) {
      const linkTarget = await readlink(src);
      await symlink(linkTarget, dest);
      continue;
    }
    if (stats.isDirectory()) {
      await mkdir(dest, { recursive: true });
      await copyInto(src, dest);
      continue;
    }
    // Regular file: copy contents, then preserve mode where reasonable.
    await copyFile(src, dest);
  }
}
