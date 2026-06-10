import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useMutationState } from "@tanstack/react-query";
import { api } from "@workspace/backend/api";

import { taskMutationKeys, tasksMutations } from "./tasks.mutations";

function getTextVariables(variables: unknown) {
  if (
    typeof variables !== "object" ||
    variables === null ||
    !("text" in variables) ||
    typeof variables.text !== "string"
  ) {
    throw new Error("Invalid task text mutation variables");
  }
  return { text: variables.text };
}

function getTaskVariables(variables: unknown) {
  if (
    typeof variables !== "object" ||
    variables === null ||
    !("taskId" in variables) ||
    typeof variables.taskId !== "string"
  ) {
    throw new Error("Invalid task mutation variables");
  }
  return { taskId: variables.taskId };
}

export function useTaskMutations() {
  const addTask = useMutation(tasksMutations.add(useConvexMutation(api.tasks.add)));
  const toggleTask = useMutation(tasksMutations.toggle(useConvexMutation(api.tasks.toggle)));
  const updateTask = useMutation(tasksMutations.update(useConvexMutation(api.tasks.update)));
  const removeTask = useMutation(tasksMutations.remove(useConvexMutation(api.tasks.remove)));
  const clearCompletedMutation = useConvexMutation(api.tasks.clearCompleted);
  const clearCompleted = useMutation(
    tasksMutations.clearCompleted(() => clearCompletedMutation({})),
  );

  const additions = useMutationState({
    filters: { mutationKey: taskMutationKeys.add(), status: "pending" },
    select: (mutation) => ({
      ...getTextVariables(mutation.state.variables),
      submittedAt: mutation.state.submittedAt,
    }),
  });
  const toggles = useMutationState({
    filters: { mutationKey: taskMutationKeys.toggle(), status: "pending" },
    select: (mutation) => getTaskVariables(mutation.state.variables),
  });
  const updates = useMutationState({
    filters: { mutationKey: taskMutationKeys.update(), status: "pending" },
    select: (mutation) => ({
      ...getTaskVariables(mutation.state.variables),
      ...getTextVariables(mutation.state.variables),
    }),
  });
  const removals = useMutationState({
    filters: { mutationKey: taskMutationKeys.remove(), status: "pending" },
    select: (mutation) => getTaskVariables(mutation.state.variables),
  });
  const clearCount = useMutationState({
    filters: { mutationKey: taskMutationKeys.clearCompleted(), status: "pending" },
    select: () => true,
  }).length;

  return {
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    clearCompleted,
    pending: {
      additions,
      toggles,
      updates,
      removals,
      isClearingCompleted: clearCount > 0,
    },
  };
}
