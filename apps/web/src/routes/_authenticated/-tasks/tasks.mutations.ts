import { mutationOptions } from "@tanstack/react-query";
import { type Id } from "@workspace/backend/dataModel";

type AddVariables = { text: string };
type TaskVariables = { taskId: Id<"tasks"> };
type UpdateVariables = TaskVariables & { text: string };

export const taskMutationKeys = {
  all: () => ["tasks"] as const,
  add: () => [...taskMutationKeys.all(), "add"] as const,
  toggle: () => [...taskMutationKeys.all(), "toggle"] as const,
  update: () => [...taskMutationKeys.all(), "update"] as const,
  remove: () => [...taskMutationKeys.all(), "remove"] as const,
  clearCompleted: () => [...taskMutationKeys.all(), "clear-completed"] as const,
};

export const tasksMutations = {
  add: (mutationFn: (variables: AddVariables) => Promise<unknown>) =>
    mutationOptions({ mutationKey: taskMutationKeys.add(), mutationFn }),
  toggle: (mutationFn: (variables: TaskVariables) => Promise<unknown>) =>
    mutationOptions({ mutationKey: taskMutationKeys.toggle(), mutationFn }),
  update: (mutationFn: (variables: UpdateVariables) => Promise<unknown>) =>
    mutationOptions({ mutationKey: taskMutationKeys.update(), mutationFn }),
  remove: (mutationFn: (variables: TaskVariables) => Promise<unknown>) =>
    mutationOptions({ mutationKey: taskMutationKeys.remove(), mutationFn }),
  clearCompleted: (mutationFn: () => Promise<unknown>) =>
    mutationOptions({
      mutationKey: taskMutationKeys.clearCompleted(),
      mutationFn,
    }),
};
