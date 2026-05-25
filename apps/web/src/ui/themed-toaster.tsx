import { Toaster } from "@workspace/ui/components/sonner";

import { useTheme } from "./theme-provider";

export function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} />;
}
