import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import { type Id } from "../_generated/dataModel";
import { type MutationCtx, type QueryCtx } from "../_generated/server";

/** Returns the authenticated user id or throws. */
export async function requireUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}
