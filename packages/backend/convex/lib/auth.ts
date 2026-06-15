import { getAuthUserId } from "@convex-dev/auth/server";
import { type Id } from "@workspace/backend/dataModel";
import { type MutationCtx, type QueryCtx } from "@workspace/backend/server";
import { ConvexError } from "convex/values";

/** Returns the authenticated user id or throws. */
export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}
