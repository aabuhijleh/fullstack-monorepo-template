import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Uniwind } from "uniwind";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

export function useThemePreference() {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
        Uniwind.setTheme(stored);
      }
    });
  }, []);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
    // Uniwind.setTheme also syncs the native color scheme (Appearance), which
    // drives the status bar and the React Navigation header theme.
    Uniwind.setTheme(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return { theme, setTheme };
}
