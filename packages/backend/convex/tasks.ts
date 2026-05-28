import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Unauthorized");
    }
    return await ctx.db.query("tasks").collect();
  },
});
