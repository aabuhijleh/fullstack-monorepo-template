import { useAuthActions } from "@convex-dev/auth/react";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { Button } from "@workspace/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty";
import { useState } from "react";

import { ModeToggle } from "~/components/mode-toggle";
import { ClearCompletedButton } from "~/components/tasks/clear-completed-button";
import { FilterTabs, type TaskFilter } from "~/components/tasks/filter-tabs";
import { TaskComposer } from "~/components/tasks/task-composer";
import { TaskList } from "~/components/tasks/task-list";
import { useTaskMutations } from "~/components/tasks/use-task-mutations";
import { generateMetadata } from "~/lib/generate-metadata";

export const Route = createFileRoute("/_authenticated/")({
  head: () => generateMetadata({ title: "Tasks" }),
  component: TasksPage,
});

function TasksPage() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list, {}));
  const { signOut } = useAuthActions();
  const { addTask, toggleTask, updateTask, removeTask, clearCompleted } = useTaskMutations();
  const [filter, setFilter] = useState<TaskFilter>("all");

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.isCompleted : t.isCompleted,
  );
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const activeCount = tasks.length - completedCount;

  return (
    <main className="mx-auto max-w-2xl p-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut().then(() => window.location.reload())}
          >
            Sign out
          </Button>
        </div>
      </div>

      <TaskComposer onAdd={addTask} />

      <div className="mt-6 mb-3 flex items-center justify-between">
        <FilterTabs value={filter} onChange={setFilter} />
        <ClearCompletedButton count={completedCount} onConfirm={clearCompleted} />
      </div>

      {visible.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{tasks.length === 0 ? "No tasks yet" : "Nothing here"}</EmptyTitle>
            <EmptyDescription>
              {tasks.length === 0 ? "Add your first task above." : "Try a different filter."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <TaskList
          tasks={visible}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onRemove={removeTask}
        />
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {activeCount} active · {completedCount} completed
      </p>
    </main>
  );
}
