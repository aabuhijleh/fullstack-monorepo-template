import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { deriveIdentity } from "./derive.ts";
import { rewriteProject } from "./rewrite.ts";

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "rewrite-test-"));

  await writeFile(
    path.join(dir, "package.json"),
    `${JSON.stringify({ name: "fullstack-monorepo-template" }, null, 2)}\n`,
  );

  // A prose file that mentions the brand token AND the generic word "mobile".
  await writeFile(
    path.join(dir, "README.md"),
    "Welcome to Tasklit. Open the mobile sidebar to navigate the mobile app.\n",
  );

  await mkdir(path.join(dir, "apps", "mobile"), { recursive: true });
  await writeFile(
    path.join(dir, "apps", "mobile", "app.json"),
    `${JSON.stringify(
      {
        expo: {
          name: "Tasklit",
          slug: "mobile",
          scheme: "mobile",
          ios: { bundleIdentifier: "com.aabuhijleh.mobile" },
          android: { package: "com.aabuhijleh.mobile" },
        },
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    path.join(dir, "fullstack-monorepo-template.code-workspace"),
    `${JSON.stringify({ folders: [{ path: "." }] }, null, 2)}\n`,
  );
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

async function walkAllFiles(root: string): Promise<Array<string>> {
  const out: Array<string> = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...(await walkAllFiles(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

test("rewriteProject swaps distinctive tokens, preserves generic words, and renames workspace", async () => {
  const id = deriveIdentity("acme-tasks");
  await rewriteProject(dir, id);

  // No distinctive token survives anywhere.
  const files = await walkAllFiles(dir);
  for (const file of files) {
    const contents = await readFile(file, "utf8");
    expect(contents).not.toContain("Tasklit");
    expect(contents).not.toContain("fullstack-monorepo-template");
    expect(contents).not.toContain("com.aabuhijleh.mobile");
  }

  // The generic word "mobile" in prose is untouched.
  const readme = await readFile(path.join(dir, "README.md"), "utf8");
  expect(readme).toContain("Acme Tasks");
  expect(readme).toContain("the mobile sidebar");
  expect(readme).toContain("the mobile app");

  // app.json identity is authoritative.
  const appJson = JSON.parse(await readFile(path.join(dir, "apps", "mobile", "app.json"), "utf8"));
  expect(appJson.expo.name).toBe("Acme Tasks");
  expect(appJson.expo.slug).toBe("acme-tasks");
  expect(appJson.expo.scheme).toBe("acme-tasks");
  expect(appJson.expo.ios.bundleIdentifier).toBe("com.acmetasks");
  expect(appJson.expo.android.package).toBe("com.acmetasks");

  // The workspace file was renamed.
  const rootEntries = await readdir(dir);
  expect(rootEntries).toContain("acme-tasks.code-workspace");
  expect(rootEntries).not.toContain("fullstack-monorepo-template.code-workspace");
});
