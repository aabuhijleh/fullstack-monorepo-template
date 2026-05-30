import React from "react";
import { Text, View } from "react-native";

import type { ThemePreference } from "~/lib/theme";

import { EditScreenInfo } from "./EditScreenInfo";
import { ThemeToggle } from "./ThemeToggle";

interface ScreenContentProps {
  title: string;
  path: string;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  children?: React.ReactNode;
}

export const ScreenContent: React.FC<ScreenContentProps> = ({
  title,
  path,
  theme,
  setTheme,
  children,
}) => {
  return (
    <View className="flex flex-1 items-center justify-center bg-white px-4 dark:bg-gray-900">
      <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</Text>
      <View className="my-7 h-px w-[300px] bg-gray-200 dark:bg-gray-700" />
      <EditScreenInfo path={path} />
      <View className="mt-7">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </View>
      {children}
    </View>
  );
};
