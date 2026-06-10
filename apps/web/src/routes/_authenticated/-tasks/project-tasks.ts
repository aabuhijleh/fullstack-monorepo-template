import { type Doc, type Id } from "@workspace/backend/dataModel";

export type ProjectedTask = {
  key: string;
  taskId?: Id<"tasks">;
  text: string;
  isCompleted: boolean;
  isPending: boolean;
};

type PendingTaskMutations = {
  additions: Array<{ text: string; submittedAt: number }>;
  toggles: Array<{ taskId: string }>;
  updates: Array<{ taskId: string; text: string }>;
  removals: Array<{ taskId: string }>;
  isClearingCompleted: boolean;
};

export function projectTasks(
  tasks: Array<Doc<"tasks">>,
  pending: PendingTaskMutations,
): Array<ProjectedTask> {
  const removedIds = new Set(pending.removals.map(({ taskId }) => taskId));
  const toggledIds = new Set(pending.toggles.map(({ taskId }) => taskId));
  const updatedText = new Map(pending.updates.map(({ taskId, text }) => [taskId, text]));

  const existingTasks = tasks
    .filter(({ _id }) => !removedIds.has(_id))
    .map((task) => {
      const isCompleted = toggledIds.has(task._id) ? !task.isCompleted : task.isCompleted;
      return {
        key: task._id,
        taskId: task._id,
        text: updatedText.get(task._id) ?? task.text,
        isCompleted,
        isPending:
          toggledIds.has(task._id) || updatedText.has(task._id) || pending.isClearingCompleted,
      };
    })
    .filter((task) => !(pending.isClearingCompleted && task.isCompleted));

  return [
    ...pending.additions.map(({ text, submittedAt }) => ({
      key: `pending-${submittedAt}`,
      text,
      isCompleted: false,
      isPending: true,
    })),
    ...existingTasks,
  ];
}
