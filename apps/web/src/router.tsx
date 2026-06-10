import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { env } from "./env";
import { createReactQueryClients } from "./lib/react-query";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const { convexQueryClient, queryClient } = createReactQueryClients(env.VITE_CONVEX_URL);

  const router = createRouter({
    routeTree,
    context: { queryClient, convexQueryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => (
      <ConvexAuthProvider client={convexQueryClient.convexClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ConvexAuthProvider>
    ),
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
