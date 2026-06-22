import { z } from "zod";

/** The set of identity tokens derived from a project slug, used to rewrite the
 *  scaffolded template into a uniquely-named project. */
export interface ProjectIdentity {
  /** npm/package name, Expo slug seed, workspace file name. e.g. "my-app". */
  slug: string;
  /** Human-facing display name. e.g. "My App". */
  displayName: string;
  /** URI scheme (hyphens are legal here). Verbatim slug. e.g. "my-app". */
  scheme: string;
  /** Reverse-DNS bundle/package id. Hyphens stripped (illegal in Android
   *  package segments). e.g. "com.myapp". */
  bundleId: string;
}

/** A valid slug: lowercase, starts with a letter, only letters/digits/hyphens. */
export const SLUG_RE = /^[a-z][a-z0-9-]*$/;

/** Zod v4 schema validating a project slug. */
export const slugSchema = z
  .string()
  .min(1, "Project name is required")
  .max(214, "Project name must be at most 214 characters")
  .regex(SLUG_RE, "Use lowercase letters, digits, and hyphens; start with a letter")
  .refine((value) => !value.endsWith("-"), "Project name must not end with a hyphen");

/** Validate raw user input as a slug. Returns a tagged result rather than
 *  throwing, so callers can render a friendly message. */
export function validateSlug(input: string) {
  const result = slugSchema.safeParse(input);
  if (result.success) {
    return { ok: true as const, slug: result.data };
  }
  const message = result.error.issues[0]?.message ?? "Invalid project name";
  return { ok: false as const, error: message };
}

/** Capitalize the first character of a word, leaving the rest untouched. */
function capitalize(word: string) {
  if (word.length === 0) return word;
  return word[0]!.toUpperCase() + word.slice(1);
}

/** Derive every identity token from a (pre-validated) slug. Pure. */
export function deriveIdentity(slug: string): ProjectIdentity {
  const displayName = slug
    .split(/[-_]/)
    .filter((word) => word.length > 0)
    .map(capitalize)
    .join(" ");

  // hyphens are legal in URI schemes, so the scheme is the slug verbatim.
  const scheme = slug;

  // Android package segments cannot contain hyphens, so strip them all.
  const bundleId = `com.${slug.replaceAll("-", "")}`;

  return { slug, displayName, scheme, bundleId };
}
