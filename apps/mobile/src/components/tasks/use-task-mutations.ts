import { api } from "@workspace/backend/api";
import type { Id } from "@workspace/backend/dataModel";
import { useMutation } from "convex/react";

export function useTaskMutations() {
  const add = useMutation(api.tasks.add).withOptimisticUpdate((store, { text }) => {
    const current = store.getQuery(api.tasks.list, {});
    if (current === undefined) return;
    store.setQuery(api.tasks.list, {}, [
      {
        _id: crypto.randomUUID() as Id<"tasks">,
        _creationTime: Date.now(),
        userId: current[0]?.userId ?? ("" as Id<"users">),
        text: text.trim(),
        isCompleted: false,
      },
      ...current,
    ]);
  });
  const toggle = useMutation(api.tasks.toggle).withOptimisticUpdate((store, { taskId }) => {
    const current = store.getQuery(api.tasks.list, {});
    if (current === undefined) return;
    store.setQuery(
      api.tasks.list,
      {},
      current.map((t) => (t._id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)),
    );
  });
  const update = useMutation(api.tasks.update).withOptimisticUpdate((store, { taskId, text }) => {
    const current = store.getQuery(api.tasks.list, {});
    if (current === undefined) return;
    store.setQuery(
      api.tasks.list,
      {},
      current.map((t) => (t._id === taskId ? { ...t, text: text.trim() } : t)),
    );
  });
  const remove = useMutation(api.tasks.remove).withOptimisticUpdate((store, { taskId }) => {
    const current = store.getQuery(api.tasks.list, {});
    if (current === undefined) return;
    store.setQuery(
      api.tasks.list,
      {},
      current.filter((t) => t._id !== taskId),
    );
  });
  const clearCompleted = useMutation(api.tasks.clearCompleted).withOptimisticUpdate((store) => {
    const current = store.getQuery(api.tasks.list, {});
    if (current === undefined) return;
    store.setQuery(
      api.tasks.list,
      {},
      current.filter((t) => !t.isCompleted),
    );
  });

  return {
    addTask: (text: string) => add({ text }),
    toggleTask: (taskId: Id<"tasks">) => toggle({ taskId }),
    updateTask: (taskId: Id<"tasks">, text: string) => update({ taskId, text }),
    removeTask: (taskId: Id<"tasks">) => remove({ taskId }),
    clearCompleted: () => clearCompleted({}),
  };
}
