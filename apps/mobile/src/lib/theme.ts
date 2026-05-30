import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function apply(preference: ThemePreference) {
  Appearance.setColorScheme(preference === "system" ? "unspecified" : preference);
}

export function useThemePreference() {
  const [theme, setThemeState] = useState<ThemePreference>("system");

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored);
        apply(stored);
      }
    });
  }, []);

  const setTheme = (next: ThemePreference) => {
    setThemeState(next);
    apply(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return { theme, setTheme };
}
