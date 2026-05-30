import { z } from "zod";

/**
 * Type-safe environment variables for the mobile app.
 *
 * `@t3-oss/env-core` is intentionally NOT used here: it breaks under React
 * Native's Metro bundler (see https://github.com/t3-oss/t3-env/issues/260), so
 * this is a lightweight zod-based equivalent that mimics the same behaviour
 * (runtime validation, client-prefix enforcement, `emptyStringAsUndefined`).
 */

const clientPrefix = "EXPO_PUBLIC_";

const client = {
  EXPO_PUBLIC_CONVEX_URL: z.string().url(),
} satisfies Record<`${typeof clientPrefix}${string}`, z.ZodTypeAny>;

/**
 * Expo statically inlines `EXPO_PUBLIC_*` variables at build time, so each one
 * must be referenced explicitly — `process.env` cannot be spread or indexed
 * dynamically. Empty strings are coerced to `undefined` so required vars fail
 * loudly instead of slipping through.
 */
const runtimeEnv = {
  EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL || undefined,
};

const parsed = z.object(client).safeParse(runtimeEnv);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
