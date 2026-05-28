import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { api } from "@workspace/backend/api"

export const Route = createFileRoute("/tasks-test")({
  beforeLoad: ({ context }) => {
    if (!context.token) {
      throw redirect({ to: "/auth" })
    }
  },
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(convexQuery(api.tasks.get, {}))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(convexQuery(api.tasks.get, {}))

  return (
    <div>
      {data.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>
  )
}
