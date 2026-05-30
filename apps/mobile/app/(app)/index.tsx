import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@workspace/backend/api";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { ThemeToggle } from "~/components/ThemeToggle";
import { useThemePreference } from "~/lib/theme";

export default function TasksScreen() {
  const tasks = useQuery(api.tasks.get);
  const { theme, setTheme } = useThemePreference();

  return (
    <>
      <Stack.Screen options={{ title: "Tasks", headerRight: renderSignOutButton }} />
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 8 }}
      >
        {tasks === undefined ? (
          <ActivityIndicator className="mt-8" />
        ) : tasks.length === 0 ? (
          <Text className="text-sm text-gray-500 dark:text-gray-400">No tasks yet.</Text>
        ) : (
          tasks.map(({ _id, text }) => (
            <View
              key={_id}
              className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
            >
              <Text className="text-base text-gray-900 dark:text-gray-100">{text}</Text>
            </View>
          ))
        )}
        <View className="mt-6 items-center">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </View>
      </ScrollView>
    </>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Pressable onPress={() => void signOut()} hitSlop={8}>
      <Text className="text-base text-blue-600 dark:text-blue-400">Sign out</Text>
    </Pressable>
  );
}

const renderSignOutButton = () => <SignOutButton />;
