import { useAuthActions } from "@convex-dev/auth/react";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@workspace/backend/api";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

export const Route = createFileRoute("/_authenticated/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(convexQuery(api.tasks.get, {}));
  },
  component: TasksPage,
});

function TasksPage() {
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}));
  const { signOut } = useAuthActions();

  return (
    <main className="mx-auto max-w-2xl p-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut().then(() => window.location.reload())}
        >
          Sign out
        </Button>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map(({ _id, text }) => (
            <Card key={_id} size="sm">
              <CardContent>
                <p className="text-sm">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
