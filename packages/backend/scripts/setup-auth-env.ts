#!/usr/bin/env bun
/**
 * setup-auth-env.ts — Provision Convex Auth env vars on the local deployment
 * (the JWKS / JWT_PRIVATE_KEY signing keys, SITE_URL, and AUTH_RESEND_KEY).
 *
 * Invoked by `setup.sh` as `bun scripts/setup-auth-env.ts` with cwd =
 * `packages/backend`, AFTER the local (anonymous) deployment already exists.
 * `.env.local` holds `CONVEX_DEPLOYMENT`, so `bunx convex env ...` targets that
 * deployment without an interactive login.
 *
 * Idempotent: if `JWKS` is already set, it leaves the existing keys untouched
 * (re-runs never rotate keys). Otherwise it generates a fresh RS256 keypair in
 * the exact shape `@convex-dev/auth` expects and sets the three env vars.
 */
import { $ } from "bun";
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

async function isJwksAlreadySet() {
  // `convex env get JWKS` always exits 0; it prints the value to stdout (empty
  // when the var is unset). So presence is determined by non-empty stdout, not
  // the exit code.
  const result = await $`bunx convex env get JWKS`.quiet().nothrow();
  return result.exitCode === 0 && result.stdout.toString().trim().length > 0;
}

async function provisionAuthKeys() {
  const keys = await generateKeyPair("RS256", { extractable: true });
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  const JWKS = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
  // PKCS8 PEM with newlines collapsed to single spaces and no trailing newline.
  const JWT_PRIVATE_KEY = privateKey.trimEnd().replace(/\n/g, " ");

  // A literal `--` precedes each value so PEM values starting with `-` are not
  // parsed as flags. Bun's `$` quotes each `${...}` as a single argv item.
  await $`bunx convex env set JWT_PRIVATE_KEY -- ${JWT_PRIVATE_KEY}`;
  await $`bunx convex env set JWKS -- ${JWKS}`;
  await $`bunx convex env set SITE_URL http://localhost:3000`;
}

/**
 * Set AUTH_RESEND_KEY on the deployment when provided via the environment
 * (the scaffolder forwards it from its prompt). It is required by
 * convex.config.ts — without it the Convex push fails — so when it is absent
 * and not already set, surface clear guidance instead of failing silently.
 */
async function ensureResendKey() {
  const key = process.env.AUTH_RESEND_KEY?.trim();
  if (key) {
    await $`bunx convex env set AUTH_RESEND_KEY -- ${key}`;
    console.log("Set AUTH_RESEND_KEY on the Convex deployment.");
    return;
  }
  // Not provided this run — it may already be set on the deployment.
  const existing = await $`bunx convex env get AUTH_RESEND_KEY`.quiet().nothrow();
  if (existing.exitCode === 0) return;
  console.warn(
    "\n⚠ AUTH_RESEND_KEY is not set — email sign-in won't work and the Convex push will fail.\n" +
      "  Get a free key at https://resend.com/api-keys, then run:\n" +
      "    cd packages/backend && bunx convex env set AUTH_RESEND_KEY <your-key>\n",
  );
}

async function main() {
  if (await isJwksAlreadySet()) {
    console.log("Convex auth keys already configured — leaving them untouched.");
  } else {
    await provisionAuthKeys();
    console.log("Convex auth keys provisioned (JWKS, JWT_PRIVATE_KEY, SITE_URL).");
  }
  await ensureResendKey();
}

try {
  await main();
} catch (error) {
  console.error("Failed to provision Convex auth keys:", error);
  process.exit(1);
}
