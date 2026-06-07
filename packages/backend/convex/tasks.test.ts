import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { describe, expect, test } from "vitest";

import { api } from "./_generated/api";
import { type Id } from "./_generated/dataModel";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

async function setup() {
  const t = convexTest(schema, modules);
  const userId = await t.run((ctx) => ctx.db.insert("users", { name: "Alice" }));
  const asUser = t.withIdentity({ subject: userId });
  return { t, userId, asUser };
}

describe("tasks", () => {
  test("list rejects anonymous callers", async () => {
    const t = convexTest(schema, modules);
    await expect(t.query(api.tasks.list, {})).rejects.toThrow();
  });

  test("add creates a task owned by the caller and list returns it", async () => {
    const { asUser, userId } = await setup();
    await asUser.mutation(api.tasks.add, { text: "  buy milk  " });
    const tasks = await asUser.query(api.tasks.list, {});
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ text: "buy milk", isCompleted: false, userId });
  });

  test("add rejects empty text", async () => {
    const { asUser } = await setup();
    await expect(asUser.mutation(api.tasks.add, { text: "   " })).rejects.toThrow(ConvexError);
  });

  test("add rejects text longer than 256 chars", async () => {
    const { asUser } = await setup();
    await expect(asUser.mutation(api.tasks.add, { text: "x".repeat(257) })).rejects.toThrow(
      ConvexError,
    );
  });

  test("list only returns the caller's tasks, newest first", async () => {
    const { t, asUser } = await setup();
    const otherId = await t.run((ctx) => ctx.db.insert("users", { name: "Bob" }));
    const asOther = t.withIdentity({ subject: otherId });
    await asUser.mutation(api.tasks.add, { text: "first" });
    await asUser.mutation(api.tasks.add, { text: "second" });
    await asOther.mutation(api.tasks.add, { text: "bob task" });
    const tasks = await asUser.query(api.tasks.list, {});
    expect(tasks.map((x) => x.text)).toEqual(["second", "first"]);
  });

  test("toggle flips completion", async () => {
    const { asUser } = await setup();
    await asUser.mutation(api.tasks.add, { text: "task" });
    const [task] = await asUser.query(api.tasks.list, {});
    await asUser.mutation(api.tasks.toggle, { taskId: task._id });
    const [after] = await asUser.query(api.tasks.list, {});
    expect(after.isCompleted).toBe(true);
  });

  test("update renames a task", async () => {
    const { asUser } = await setup();
    await asUser.mutation(api.tasks.add, { text: "old" });
    const [task] = await asUser.query(api.tasks.list, {});
    await asUser.mutation(api.tasks.update, { taskId: task._id, text: "new" });
    const [after] = await asUser.query(api.tasks.list, {});
    expect(after.text).toBe("new");
  });

  test("remove deletes a task", async () => {
    const { asUser } = await setup();
    await asUser.mutation(api.tasks.add, { text: "task" });
    const [task] = await asUser.query(api.tasks.list, {});
    await asUser.mutation(api.tasks.remove, { taskId: task._id });
    expect(await asUser.query(api.tasks.list, {})).toHaveLength(0);
  });

  test("clearCompleted deletes only completed tasks", async () => {
    const { asUser } = await setup();
    await asUser.mutation(api.tasks.add, { text: "keep" });
    await asUser.mutation(api.tasks.add, { text: "drop" });
    const tasks = await asUser.query(api.tasks.list, {});
    const drop = tasks.find((x) => x.text === "drop")!;
    await asUser.mutation(api.tasks.toggle, { taskId: drop._id });
    await asUser.mutation(api.tasks.clearCompleted, {});
    const after = await asUser.query(api.tasks.list, {});
    expect(after.map((x) => x.text)).toEqual(["keep"]);
  });

  test("a user cannot toggle another user's task", async () => {
    const { t, asUser } = await setup();
    const otherId = await t.run((ctx) => ctx.db.insert("users", { name: "Bob" }));
    const asOther = t.withIdentity({ subject: otherId });
    await asOther.mutation(api.tasks.add, { text: "bob task" });
    const bobTask = (await asOther.query(api.tasks.list, {}))[0] as { _id: Id<"tasks"> };
    await expect(asUser.mutation(api.tasks.toggle, { taskId: bobTask._id })).rejects.toThrow(
      ConvexError,
    );
  });
});
