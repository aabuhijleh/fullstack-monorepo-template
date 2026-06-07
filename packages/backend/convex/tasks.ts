import { ConvexError } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { taskIdValidator, taskTextValidator, taskValidator } from "./lib/validators";
import { zMutation, zQuery } from "./lib/zod";

async function requireOwnedTask(ctx: MutationCtx, taskId: Id<"tasks">): Promise<Doc<"tasks">> {
  const userId = await requireUserId(ctx);
  const task = await ctx.db.get("tasks", taskId);
  if (task === null || task.userId !== userId) {
    throw new ConvexError("Task not found");
  }
  return task;
}

export const list = zQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    // In a real app, you'd likely want a paginated query here for scalability.
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = zMutation({
  args: taskTextValidator,
  handler: async (ctx, { text }) => {
    const userId = await requireUserId(ctx);
    await ctx.db.insert("tasks", {
      userId,
      text,
      isCompleted: false,
    });
  },
});

export const toggle = zMutation({
  args: taskIdValidator,
  handler: async (ctx, { taskId }) => {
    const task = await requireOwnedTask(ctx, taskId);
    await ctx.db.patch("tasks", taskId, { isCompleted: !task.isCompleted });
  },
});

export const update = zMutation({
  args: taskValidator,
  handler: async (ctx, { taskId, text }) => {
    await requireOwnedTask(ctx, taskId);
    await ctx.db.patch("tasks", taskId, { text });
  },
});

export const remove = zMutation({
  args: taskIdValidator,
  handler: async (ctx, { taskId }) => {
    await requireOwnedTask(ctx, taskId);
    await ctx.db.delete("tasks", taskId);
  },
});

export const clearCompleted = zMutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const completed = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(
      completed.filter((task) => task.isCompleted).map((task) => ctx.db.delete("tasks", task._id)),
    );
  },
});
