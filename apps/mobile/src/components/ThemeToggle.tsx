import React from "react";
import { Pressable, Text, View } from "react-native";

import { type ThemePreference } from "~/lib/theme";

interface ThemeToggleProps {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const OPTIONS: ThemePreference[] = ["light", "dark", "system"];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  return (
    <View className="flex-row rounded-lg border border-gray-300 p-1 dark:border-gray-700">
      {OPTIONS.map((option) => {
        const active = theme === option;
        return (
          <Pressable
            key={option}
            onPress={() => setTheme(option)}
            className={`rounded-md px-4 py-2 ${active ? "bg-gray-900 dark:bg-gray-100" : ""}`}
          >
            <Text
              className={`text-sm capitalize ${
                active ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
