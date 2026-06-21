import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppLogo } from "~/components/app-logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { useThemePreference } from "~/lib/theme";

import { FilterTabs, type TaskFilter } from "./filter-tabs";
import { projectTasks } from "./project-tasks";
import { TaskComposer } from "./task-composer";
import { TaskEmptyState } from "./task-empty-state";
import { TaskList } from "./task-list";
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

  const addTask = (text: string) =>
    mutations.addTask.mutate({ text }, { onError: showMutationError });

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

  // SafeAreaView (from react-native-safe-area-context) has no default flex; keep
  // the background + fill on the className-styled View and use SafeAreaView only
  // for top/bottom insets via an inline flex: 1.
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View className="flex-1 px-4">
          <Header theme={theme} setTheme={setTheme} />

          <TaskComposer
            onAdd={(text) => {
              addTask(text);
              return Promise.resolve();
            }}
          />

          <View className="mt-6 mb-3 flex-row items-center gap-3">
            <FilterTabs value={filter} onChange={setFilter} />
            {completedCount > 0 ? (
              <Pressable onPress={confirmClear} hitSlop={8}>
                <Text className="font-sans text-xs tracking-wide text-muted-foreground uppercase">
                  Clear
                </Text>
              </Pressable>
            ) : null}
          </View>

          <SectionLabel label={filter} count={visible.length} />

          <View className="flex-1">
            {tasksQuery.isPending ? (
              <ActivityIndicator className="mt-8" />
            ) : tasks.length === 0 ? (
              <TaskEmptyState onAdd={addTask} />
            ) : visible.length === 0 ? (
              <Text className="mt-8 text-center font-sans text-sm text-muted-foreground">
                Nothing here.
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
        </View>
      </SafeAreaView>
    </View>
  );
}

function Header({
  theme,
  setTheme,
}: {
  theme: ReturnType<typeof useThemePreference>["theme"];
  setTheme: ReturnType<typeof useThemePreference>["setTheme"];
}) {
  return (
    <View className="mb-8 flex-row items-center justify-between gap-4 pt-2">
      <View className="flex-row items-center gap-2.5">
        <AppLogo size={28} />
        <Text className="font-heading text-sm tracking-[4px] text-foreground uppercase">
          Tasklit
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <SignOutButton />
      </View>
    </View>
  );
}

function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => void signOut()}
      className="h-8 items-center justify-center border border-border bg-background px-3 active:bg-muted"
    >
      <Text className="font-sans text-xs font-medium text-foreground">Sign out</Text>
    </Pressable>
  );
}

const SECTION_LABELS: Record<TaskFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Completed",
};

function SectionLabel({ label, count }: { label: TaskFilter; count: number }) {
  return (
    <View className="mb-1 flex-row items-center gap-2 border-b border-border pb-1">
      <Text className="font-sans-medium text-xs tracking-[3px] text-muted-foreground uppercase">
        {SECTION_LABELS[label]}
      </Text>
      <Text className="font-sans text-xs text-muted-foreground">{count}</Text>
    </View>
  );
}
