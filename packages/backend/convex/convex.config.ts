import { defineApp } from "convex/server";
import { v } from "convex/values";

/**
 * Typed, deploy-validated environment variables for the Convex backend.
 *
 * Declaring vars here makes Convex verify they are set at deploy time (fail
 * fast) and exposes them as a typed `env` object from `./_generated/server`.
 * See https://docs.convex.dev/production/environment-variables#declaring
 *
 * `CONVEX_SITE_URL` is intentionally NOT declared — it is a system variable
 * auto-provided by Convex, read directly from `process.env` in `auth.config.ts`.
 */
const app = defineApp({
  env: {
    // Managed by `@convex-dev/auth`.
    JWKS: v.string(),
    JWT_PRIVATE_KEY: v.string(),
    SITE_URL: v.string(),
    // Needed for sending email OTPs.
    AUTH_RESEND_KEY: v.string(),
  },
});

export default app;
