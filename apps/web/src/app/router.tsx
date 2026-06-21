import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { env } from "~/config/env";

import { routeTree } from "./routeTree.gen";

function createReactQueryClients(convexUrl: string) {
  const convexQueryClient = new ConvexQueryClient(convexUrl);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);
  return { convexQueryClient, queryClient };
}

export function getRouter() {
  const { convexQueryClient, queryClient } = createReactQueryClients(env.VITE_CONVEX_URL);

  const router = createRouter({
    routeTree,
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
