#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import { cancel, intro, isCancel, log as clackLog, outro, spinner, text } from "@clack/prompts";

import { copyTemplate } from "./copy.ts";
import { deriveIdentity, validateSlug } from "./derive.ts";
import { rewriteProject } from "./rewrite.ts";

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      "skip-setup": { type: "boolean", default: false },
    },
  });
  const skipSetup = values["skip-setup"];

  intro("create-modern-monorepo");

  // ---- resolve the slug (from a positional, or by prompting) ----
  const slug = await resolveSlug(positionals[0]);

  // ---- Resend API key for email sign-in (skippable; only needed when running setup) ----
  const resendKey = skipSetup ? "" : await promptResendKey();

  // ---- target directory must be absent or empty ----
  const targetDir = path.resolve(process.cwd(), slug);
  if (await isNonEmptyDir(targetDir)) {
    cancel(`Directory "${slug}" already exists and is not empty`);
    process.exit(1);
  }

  const id = deriveIdentity(slug);

  // ---- the bundled template must exist (built via build:template) ----
  const templateDir = path.join(import.meta.dir, "..", "template");
  if (!existsSync(templateDir)) {
    cancel(
      "This package was published without a bundled template. " +
        "Run `bun run build:template` before packing/publishing.",
    );
    process.exit(1);
  }

  // ---- scaffold ----
  const s = spinner();
  s.start("Creating project files");
  await copyTemplate(templateDir, targetDir);
  s.message("Personalizing");
  await rewriteProject(targetDir, id);
  s.stop("Project files created");

  // ---- git init (non-fatal) ----
  initGitRepo(targetDir);

  // ---- run setup.sh (unless skipped) ----
  if (skipSetup) {
    clackLog.info("Skipping setup (--skip-setup).");
  } else {
    runSetup(targetDir, resendKey);
  }

  // ---- next steps ----
  const steps: Array<string> = ["Next steps:", `  cd ${slug}`];
  if (skipSetup) {
    steps.push(`  ./setup.sh   # install deps & provision the backend`);
  }
  steps.push(
    `  bun dev`,
    ``,
    `  web → http://localhost:3000`,
    `  iOS → builds in the Simulator on first run (a few minutes)`,
  );
  if (!resendKey) {
    steps.push(
      ``,
      `Email sign-in needs a Resend API key (free at https://resend.com/api-keys):`,
      `  cd packages/backend && bunx convex env set AUTH_RESEND_KEY <your-key>`,
      `  then restart \`bun dev\`.`,
    );
  }
  outro(steps.join("\n"));
}

/** Resolve a validated slug from a positional arg, or prompt for one. */
async function resolveSlug(positional: string | undefined) {
  if (positional !== undefined) {
    const result = validateSlug(positional);
    if (!result.ok) {
      cancel(result.error);
      process.exit(1);
    }
    return result.slug;
  }

  const answer = await text({
    message: "Project name",
    placeholder: "my-app",
    validate: (value) => {
      const result = validateSlug(value);
      return result.ok ? undefined : result.error;
    },
  });
  if (isCancel(answer)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  // `validate` guarantees this is a valid slug.
  return answer;
}

/** Prompt for a Resend API key used to email sign-in OTPs. Skippable (Enter). */
async function promptResendKey() {
  const answer = await text({
    message:
      "Resend API key for email sign-in\n" +
      "  Get one free at https://resend.com/api-keys — or press Enter to skip and add it later.",
    placeholder: "re_… (press Enter to skip)",
    defaultValue: "",
    validate: (value) => {
      const trimmed = value.trim();
      if (trimmed && !trimmed.startsWith("re_")) return "A Resend API key starts with 're_'.";
      return undefined;
    },
  });
  if (isCancel(answer)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return answer.trim();
}

async function isNonEmptyDir(dir: string) {
  try {
    const entries = await readdir(dir);
    return entries.length > 0;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

/** `git init` + an initial commit. Non-fatal: a missing git just warns. */
function initGitRepo(targetDir: string) {
  const git = (...args: Array<string>) =>
    spawnSync("git", args, { cwd: targetDir, stdio: "ignore" });

  const init = git("init", "-q");
  if (init.error) {
    clackLog.warn("git not found — skipping repo initialization.");
    return;
  }
  git("add", "-A");
  // Pass a fallback identity inline so the commit works even when the user's
  // global git identity is unset; this never overwrites their global config.
  git(
    "-c",
    "user.name=create-modern-monorepo",
    "-c",
    "user.email=scaffold@example.com",
    "commit",
    "-q",
    "-m",
    "chore: scaffold project from create-modern-monorepo",
  );
}

/** Run the project's setup.sh (skipping the iOS prebuild). Streams its own
 *  progress straight to the terminal. Non-fatal on failure. The Resend key, when
 *  provided, is forwarded so setup provisions AUTH_RESEND_KEY on the backend. */
function runSetup(targetDir: string, resendKey: string) {
  clackLog.info("Installing dependencies & provisioning backend (this can take a minute)…");
  const result = spawnSync("bash", ["setup.sh", "--no-prebuild"], {
    cwd: targetDir,
    stdio: ["ignore", "inherit", "inherit"],
    env: resendKey ? { ...process.env, AUTH_RESEND_KEY: resendKey } : process.env,
  });
  if (result.error || (typeof result.status === "number" && result.status !== 0)) {
    clackLog.warn(
      "setup.sh did not complete cleanly — you can re-run `./setup.sh` inside the project.",
    );
  }
}

try {
  await main();
} catch (error) {
  cancel(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
