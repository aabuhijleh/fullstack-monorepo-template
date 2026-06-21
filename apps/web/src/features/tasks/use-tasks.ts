import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@workspace/backend/api";
import { type Doc, type Id } from "@workspace/backend/dataModel";

export type TaskFilter = "all" | "active" | "completed";

/** Shared props every task-board design variant renders from. */
export type TaskBoardProps = {
  tasks: Array<Doc<"tasks">>;
  total: number;
  completed: number;
  active: number;
  percent: number;
  onAdd: (text: string) => void;
  onToggle: (taskId: Id<"tasks">) => void;
  onUpdate: (taskId: Id<"tasks">, text: string) => void;
  onRemove: (taskId: Id<"tasks">) => void;
  onClearCompleted: () => void;
  isAdding?: boolean;
  isClearing?: boolean;
};

/** Wires the Convex task queries/mutations into the shared board props. */
export function useTasks(): TaskBoardProps {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list));
  const add = useMutation({ mutationFn: useConvexMutation(api.tasks.add) });
  const toggle = useMutation({ mutationFn: useConvexMutation(api.tasks.toggle) });
  const update = useMutation({ mutationFn: useConvexMutation(api.tasks.update) });
  const remove = useMutation({ mutationFn: useConvexMutation(api.tasks.remove) });
  const clearCompleted = useMutation({ mutationFn: useConvexMutation(api.tasks.clearCompleted) });

  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const active = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    tasks,
    total,
    completed,
    active,
    percent,
    onAdd: (text) => add.mutate({ text }),
    onToggle: (taskId) => toggle.mutate({ taskId }),
    onUpdate: (taskId, text) => update.mutate({ taskId, text }),
    onRemove: (taskId) => remove.mutate({ taskId }),
    onClearCompleted: () => clearCompleted.mutate({}),
    isAdding: add.isPending,
    isClearing: clearCompleted.isPending,
  };
}
