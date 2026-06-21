import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    nitro(),
    tailwindcss(),
    tanstackStart({
      // App layer lives under src/app: thin routes + router entry + chrome.
      router: {
        entry: "app/router.tsx",
        routesDirectory: "app/routes",
        generatedRouteTree: "app/routeTree.gen.ts",
      },
      spa: {
        enabled: true,
        prerender: {
          outputPath: "/index",
        },
      },
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    open: true,
  },
});

export default config;
