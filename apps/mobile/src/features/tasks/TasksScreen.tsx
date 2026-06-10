import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { ThemeToggle } from "~/components/ThemeToggle";
import { useThemePreference } from "~/lib/theme";

import { FilterTabs, type TaskFilter } from "./FilterTabs";
import { projectTasks } from "./project-tasks";
import { TaskComposer } from "./TaskComposer";
import { TaskList } from "./TaskList";
import { tasksQueries } from "./tasks.queries";
import { useTaskMutations } from "./use-task-mutations";

const showMutationError = () => Alert.alert("Something went wrong", "Please try again.");

export function TasksScreen() {
  const tasksQuery = useQuery(tasksQueries.list());
  const mutations = useTaskMutations();
  const { theme, setTheme } = useThemePreference();
  const [filter, setFilter] = useState<TaskFilter>("all");

  const tasks = projectTasks(tasksQuery.data ?? [], mutations.pending);
  const visible = tasks.filter((task) =>
    filter === "all" ? true : filter === "active" ? !task.isCompleted : task.isCompleted,
  );
  const completedCount = tasks.filter((task) => task.isCompleted).length;

  function confirmClear() {
    Alert.alert("Clear completed?", `Delete ${completedCount} completed task(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => mutations.clearCompleted.mutate(undefined, { onError: showMutationError }),
      },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Tasks", headerRight: renderSignOutButton }} />
      <View className="flex-1 bg-background p-4">
        <TaskComposer
          onAdd={(text) => {
            mutations.addTask.mutate({ text }, { onError: showMutationError });
            return Promise.resolve();
          }}
        />
        <View className="mt-4 mb-2 flex-row items-center gap-3">
          <FilterTabs value={filter} onChange={setFilter} />
          {completedCount > 0 ? (
            <Pressable onPress={confirmClear} hitSlop={8}>
              <Text className="text-sm text-primary">Clear</Text>
            </Pressable>
          ) : null}
        </View>
        <View className="flex-1">
          {tasksQuery.isPending ? (
            <ActivityIndicator className="mt-8" />
          ) : visible.length === 0 ? (
            <Text className="mt-8 text-center text-sm text-muted-foreground">
              {tasks.length === 0 ? "No tasks yet. Add one above." : "Nothing here."}
            </Text>
          ) : (
            <TaskList
              tasks={visible}
              onToggle={(taskId) =>
                mutations.toggleTask.mutate({ taskId }, { onError: showMutationError })
              }
              onUpdate={(taskId, text) =>
                mutations.updateTask.mutate({ taskId, text }, { onError: showMutationError })
              }
              onRemove={(taskId) =>
                mutations.removeTask.mutate({ taskId }, { onError: showMutationError })
              }
            />
          )}
        </View>
        <View className="mt-4 items-center">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </View>
      </View>
    </>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Pressable onPress={() => void signOut()} hitSlop={8}>
      <Text className="text-base text-primary">Sign out</Text>
    </Pressable>
  );
}

const renderSignOutButton = () => <SignOutButton />;
