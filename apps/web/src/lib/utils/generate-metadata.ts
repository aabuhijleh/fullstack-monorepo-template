import { createMetadataGenerator } from "tanstack-meta";

import { env } from "~/config/env";

const DEFAULT_TITLE = "Tasklit";
const TITLE_TEMPLATE = "%s | Tasklit";

const metadataGenerator = createMetadataGenerator({
  titleTemplate: { default: DEFAULT_TITLE, template: TITLE_TEMPLATE },
  baseUrl: env.VITE_APP_BASE_URL,
});

export function generateMetadata(
  ...args: Parameters<typeof metadataGenerator>
): ReturnType<typeof metadataGenerator> {
  const [input] = args;

  if (input.title === DEFAULT_TITLE) {
    input.title = null;
  }

  if (input.title && !input.openGraph) {
    const titleText = typeof input.title === "string" ? input.title : input.title.absolute;
    const resolvedTitle = TITLE_TEMPLATE.replace("%s", titleText);
    input.openGraph = { title: resolvedTitle };
  }

  return metadataGenerator(input);
}
