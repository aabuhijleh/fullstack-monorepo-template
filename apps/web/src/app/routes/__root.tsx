import { HeadContent, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

import { ThemeProvider } from "~/app/components/theme-provider";
import { ThemedToaster } from "~/app/components/themed-toaster";
import { env } from "~/config/env";
import { generateMetadata } from "~/lib/utils/generate-metadata";

import appCss from "@workspace/ui/globals.css?url";

export const Route = createRootRouteWithContext()({
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
