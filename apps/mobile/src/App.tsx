import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ScreenContent } from "~/components/ScreenContent";

import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <ScreenContent title="Home" path="src/App.tsx"></ScreenContent>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
