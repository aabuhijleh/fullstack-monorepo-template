import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "@workspace/backend/api"
import { Authenticated, Unauthenticated } from "convex/react"

export const Route = createFileRoute("/tasks")({
  component: () => (
    <>
      <Authenticated>
        <RouteComponent />
      </Authenticated>
      <Unauthenticated>You are not authenticated</Unauthenticated>
    </>
  ),
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
