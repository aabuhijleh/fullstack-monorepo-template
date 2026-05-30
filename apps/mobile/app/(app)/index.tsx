import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@workspace/backend/api";
import { useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

import { FilterTabs, type TaskFilter } from "~/components/tasks/FilterTabs";
import { TaskComposer } from "~/components/tasks/TaskComposer";
import { TaskList } from "~/components/tasks/TaskList";
import { useTaskMutations } from "~/components/tasks/use-task-mutations";

export default function TasksScreen() {
  const tasks = useQuery(api.tasks.list);
  const { addTask, toggleTask, updateTask, removeTask, clearCompleted } = useTaskMutations();
  const [filter, setFilter] = useState<TaskFilter>("all");

  const visible = (tasks ?? []).filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.isCompleted : t.isCompleted,
  );
  const completedCount = (tasks ?? []).filter((t) => t.isCompleted).length;

  function confirmClear() {
    Alert.alert("Clear completed?", `Delete ${completedCount} completed task(s)?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => void clearCompleted() },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: "Tasks", headerRight: renderSignOutButton }} />
      <View className="flex-1 bg-white p-4 dark:bg-gray-900">
        <TaskComposer onAdd={addTask} />
        <View className="mt-4 mb-2 flex-row items-center justify-between">
          <FilterTabs value={filter} onChange={setFilter} />
          {completedCount > 0 ? (
            <Pressable onPress={confirmClear} hitSlop={8}>
              <Text className="text-sm text-blue-600 dark:text-blue-400">Clear</Text>
            </Pressable>
          ) : null}
        </View>
        {tasks === undefined ? (
          <ActivityIndicator className="mt-8" />
        ) : visible.length === 0 ? (
          <Text className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {tasks.length === 0 ? "No tasks yet. Add one above." : "Nothing here."}
          </Text>
        ) : (
          <TaskList
            tasks={visible}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onRemove={removeTask}
          />
        )}
      </View>
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
