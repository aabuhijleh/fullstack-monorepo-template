import { describe, expect, test } from "bun:test";

import { deriveIdentity, validateSlug } from "./derive.ts";

describe("validateSlug", () => {
  test("accepts valid slugs", () => {
    for (const slug of ["my-app", "todo", "a", "app123", "a-b-c"]) {
      const result = validateSlug(slug);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.slug).toBe(slug);
    }
  });

  test("rejects invalid slugs", () => {
    for (const bad of ["My-App", "1app", "my_app", "my-app-", "my app", "", "-app"]) {
      const result = validateSlug(bad);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(typeof result.error).toBe("string");
    }
  });
});

describe("deriveIdentity", () => {
  test("derives every token for a hyphenated slug", () => {
    expect(deriveIdentity("my-app")).toEqual({
      slug: "my-app",
      displayName: "My App",
      scheme: "my-app",
      bundleId: "com.myapp",
    });
  });

  test("derives a single-word slug", () => {
    const id = deriveIdentity("todo");
    expect(id.displayName).toBe("Todo");
    expect(id.bundleId).toBe("com.todo");
  });

  test("bundleId never contains a hyphen", () => {
    for (const slug of ["my-app", "a-b-c-d", "todo", "acme-tasks-2"]) {
      expect(deriveIdentity(slug).bundleId).not.toContain("-");
    }
  });
});
