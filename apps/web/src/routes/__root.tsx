import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@workspace/ui/components/sonner";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { ThemeProvider, useTheme } from "~/components/theme-provider";
import { env } from "~/env";
import { getAuthToken } from "~/lib/convex-auth-cookies";
import { generateMetadata } from "~/lib/generate-metadata";

import appCss from "@workspace/ui/globals.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  beforeLoad: async ({ context }) => {
    const token = await getAuthToken();
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { token };
  },
  head: () => {
    const title = "Tasklit";
    const description = "A simple, fast task manager.";

    const { meta, links } = generateMetadata({
      charSet: "utf-8",
      viewport: { width: "device-width", initialScale: 1 },
      title,
      description,
      openGraph: {
        title,
        description,
        images: ["/og.png"],
        url: env.VITE_APP_BASE_URL,
      },
      icons: { icon: "/favicon.ico", apple: "/logo180.png" },
      manifest: "/manifest.json",
    });

    return {
      meta,
      links: [...links, { rel: "stylesheet", href: appCss }],
    };
  },
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
});

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <TooltipProvider>{children}</TooltipProvider>
          <ThemedToaster />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
