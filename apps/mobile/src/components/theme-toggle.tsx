import {
  Monitor as LucideMonitor,
  Moon as LucideMoon,
  Sun as LucideSun,
} from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { withUniwind } from "uniwind";

import { type ThemePreference } from "~/lib/theme";

const Sun = withUniwind(LucideSun);
const Moon = withUniwind(LucideMoon);
const Monitor = withUniwind(LucideMonitor);

interface ThemeToggleProps {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const NEXT: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

/**
 * Square header toggle mirroring the web's icon button. The web uses a 3-item
 * dropdown; mobile cycles light → dark → system on tap, showing the icon for
 * the current preference.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const Icon = ICONS[theme];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${theme}. Tap to change.`}
      hitSlop={6}
      onPress={() => setTheme(NEXT[theme])}
      className="size-8 items-center justify-center border border-border bg-background active:bg-muted dark:border-input dark:bg-input/30 dark:active:bg-input/50"
    >
      <Icon size={16} colorClassName="accent-foreground" />
    </Pressable>
  );
};
