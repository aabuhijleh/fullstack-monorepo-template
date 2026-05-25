import { z } from "zod";

/**
 * Type-safe environment variables for the Convex backend.
 *
 * These are read from the deployment's environment (managed via `bunx convex
 * env set` or the dashboard — see `.env.example`). Validation runs the first
 * time this module is imported, so a missing/invalid var fails fast on deploy
 * instead of surfacing as an obscure runtime error deep inside a function.
 *
 * NOTE: `CONVEX_DEPLOYMENT` and `CONVEX_URL` are intentionally NOT validated
 * here — they are CLI/client-side variables (`.env.local`) and are not present
 * in the Convex function runtime. Only deployment-runtime vars belong here.
 */
const schema = z.object({
  // Auto-provided by Convex; used as the auth provider domain.
  CONVEX_SITE_URL: z.url(),
  // Managed by `@convex-dev/auth`.
  JWKS: z.string().min(1),
  JWT_PRIVATE_KEY: z.string().min(1),
  SITE_URL: z.url(),
  // Needed for sending email OTPs.
  AUTH_RESEND_KEY: z.string().min(1),
});

// Read each var explicitly rather than passing the live `process.env`. Convex
// evaluates this module while analyzing `auth.config.ts` with `process.env`
// wrapped in a recording Proxy; handing that proxy to zod triggers a thenable
// (`.then`) probe that Convex misreads as a required env var named `then`.
const parsed = schema.safeParse({
  CONVEX_SITE_URL: process.env.CONVEX_SITE_URL,
  JWKS: process.env.JWKS,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  SITE_URL: process.env.SITE_URL,
  AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
