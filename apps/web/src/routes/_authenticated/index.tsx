import { useAuthActions } from "@convex-dev/auth/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty";
import { useState } from "react";

import { ThemeToggle } from "~/components/theme-toggle";
import { generateMetadata } from "~/lib/utils/generate-metadata";

import { ClearCompletedButton } from "./-tasks/clear-completed-button";
import { FilterTabs, type TaskFilter } from "./-tasks/filter-tabs";
import { projectTasks } from "./-tasks/project-tasks";
import { TaskComposer } from "./-tasks/task-composer";
import { TaskList } from "./-tasks/task-list";
import { tasksQueries } from "./-tasks/tasks.queries";
import { useTaskMutations } from "./-tasks/use-task-mutations";

export const Route = createFileRoute("/_authenticated/")({
  head: () => generateMetadata({ title: "Tasks" }),
  component: TasksPage,
});

function TasksPage() {
  const tasksQuery = useSuspenseQuery(tasksQueries.list());
  const { signOut } = useAuthActions();
  const mutations = useTaskMutations();
  const [filter, setFilter] = useState<TaskFilter>("all");

  const tasks = projectTasks(tasksQuery.data, mutations.pending);
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
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <TaskComposer
        onAdd={(text) => {
          mutations.addTask.mutate({ text }, { onError: mutations.onError });
          return Promise.resolve();
        }}
      />

      <div className="mt-6 mb-3 flex items-center justify-between">
        <FilterTabs value={filter} onChange={setFilter} />
        <ClearCompletedButton
          count={completedCount}
          onConfirm={() =>
            mutations.clearCompleted.mutate(undefined, { onError: mutations.onError })
          }
        />
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
          onToggle={(taskId) =>
            mutations.toggleTask.mutate({ taskId }, { onError: mutations.onError })
          }
          onUpdate={(taskId, text) =>
            mutations.updateTask.mutate({ taskId, text }, { onError: mutations.onError })
          }
          onRemove={(taskId) =>
            mutations.removeTask.mutate({ taskId }, { onError: mutations.onError })
          }
        />
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {activeCount} active · {completedCount} completed
      </p>
    </main>
  );
}
