import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ScreenContent } from "~/components/ScreenContent";
import { useThemePreference } from "~/lib/theme";

import "./global.css";

export default function App() {
  const { theme, setTheme } = useThemePreference();

  return (
    <SafeAreaProvider>
      <ScreenContent title="Home" path="src/App.tsx" theme={theme} setTheme={setTheme} />
      <StatusBar />
    </SafeAreaProvider>
  );
}
