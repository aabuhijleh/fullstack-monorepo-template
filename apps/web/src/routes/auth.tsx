import { createFileRoute } from "@tanstack/react-router"
import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
})

function RouteComponent() {
  const { signIn, signOut } = useAuthActions()
  const { isAuthenticated } = useConvexAuth()

  if (isAuthenticated) {
    return (
      <div>
        <p>You are logged in</p>
        <button onClick={() => signOut()}>Log out</button>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        await signIn("resend", formData)
        console.log("sign-in link sent")
      }}
    >
      <p>Enter your email to sign in</p>
      <input name="email" placeholder="Email" type="text" />
      <button type="submit">Send sign-in link</button>
    </form>
  )
}
