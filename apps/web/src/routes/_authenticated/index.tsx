import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: TasksPage,
});

function TasksPage() {
  return <div>Tasks</div>;
}
