import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

/** Returns the authenticated user id or throws. */
export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}

/** Loads a task and asserts the caller owns it, else throws. */
export async function requireOwnedTask(
  ctx: MutationCtx,
  taskId: Id<"tasks">,
): Promise<Doc<"tasks">> {
  const userId = await requireUserId(ctx);
  const task = await ctx.db.get("tasks", taskId);
  if (task === null || task.userId !== userId) {
    throw new ConvexError("Task not found");
  }
  return task;
}
