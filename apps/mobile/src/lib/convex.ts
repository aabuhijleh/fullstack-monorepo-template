import { ConvexReactClient } from "convex/react";

import { env } from "~/config/env";

export const convex = new ConvexReactClient(env.EXPO_PUBLIC_CONVEX_URL, {
  unsavedChangesWarning: false,
});
