import { expect, test, vi } from "vitest";

vi.mock("~/env", () => ({
  env: { VITE_APP_BASE_URL: "http://localhost:3000" },
}));

const { generateMetadata } = await import("./generate-metadata");

test("blanks the default title instead of templating it", () => {
  const { meta } = generateMetadata({ title: "Tasklit" });
  const titleMeta = meta.find((m) => m && "title" in m);
  expect(titleMeta && "title" in titleMeta ? titleMeta.title : undefined).not.toBe(
    "Tasklit | Tasklit",
  );
});

test("derives an Open Graph title from the template", () => {
  const { meta } = generateMetadata({ title: "Tasks" });
  const ogTitleMeta = meta.find((m) => m && "property" in m && m.property === "og:title");
  expect(ogTitleMeta && "content" in ogTitleMeta ? ogTitleMeta.content : undefined).toBe(
    "Tasks | Tasklit",
  );
});
