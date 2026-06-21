import { Stack } from "expo-router";

export default function AppLayout() {
  // The Tasks screen renders its own TASKLIT header (logo, theme toggle, sign
  // out), so the native stack header is hidden.
  return <Stack screenOptions={{ headerShown: false }} />;
}
