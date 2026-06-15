import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";

export const Route = createFileRoute("/_authenticated/")({
  component: TasksPage,
});

function TasksPage() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list));
  return <pre>{JSON.stringify(tasks, null, 2)}</pre>;
}
