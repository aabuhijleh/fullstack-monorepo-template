import React from "react";
import { Pressable, Text, View } from "react-native";

import { type ThemePreference } from "~/lib/theme";

interface ThemeToggleProps {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const OPTIONS: Array<ThemePreference> = ["light", "dark", "system"];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  return (
    <View className="flex-row rounded-lg border border-border p-1">
      {OPTIONS.map((option) => {
        const active = theme === option;
        return (
          <Pressable
            key={option}
            onPress={() => setTheme(option)}
            className={`rounded-md px-4 py-2 ${active ? "bg-primary" : ""}`}
          >
            <Text
              className={`text-sm capitalize ${
                active ? "text-primary-foreground" : "text-muted-foreground"
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
