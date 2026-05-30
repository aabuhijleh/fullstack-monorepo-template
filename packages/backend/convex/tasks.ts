import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";
import { requireOwnedTask, requireUserId } from "./lib/auth";
import { parseTaskText } from "./lib/validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const userId = await requireUserId(ctx);
    await ctx.db.insert("tasks", {
      userId,
      text: parseTaskText(text),
      isCompleted: false,
    });
  },
});

export const toggle = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await requireOwnedTask(ctx, taskId);
    await ctx.db.patch("tasks", taskId, { isCompleted: !task.isCompleted });
  },
});

export const update = mutation({
  args: { taskId: v.id("tasks"), text: v.string() },
  handler: async (ctx, { taskId, text }) => {
    await requireOwnedTask(ctx, taskId);
    await ctx.db.patch("tasks", taskId, { text: parseTaskText(text) });
  },
});

export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    await requireOwnedTask(ctx, taskId);
    await ctx.db.delete("tasks", taskId);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const completed = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const task of completed) {
      if (task.isCompleted) {
        await ctx.db.delete("tasks", task._id);
      }
    }
  },
});

// One-off: wipe legacy global rows so the new required `userId` validates.
// Run with `bunx convex run tasks:wipeAll`, then this can be removed.
export const wipeAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    for (const task of all) {
      await ctx.db.delete("tasks", task._id);
    }
  },
});
