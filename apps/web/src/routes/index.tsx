import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { api } from "@/lib/api"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("password")
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.protected.me
      .$get()
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setUserEmail(data.email)
          setLoggedIn(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async () => {
    setError(null)
    try {
      const res = await api.auth.login.$post({
        json: { email, password },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error("error" in data ? data.error : `HTTP ${res.status}`)
      }
      setLoggedIn(true)
      const meRes = await api.protected.me.$get()
      if (meRes.ok) {
        const meData = await meRes.json()
        setUserEmail(meData.email)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const logout = async () => {
    await api.auth.logout.$post()
    setLoggedIn(false)
    setUserEmail(null)
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="font-medium">Authentication</h2>
          {loading ? (
            <p>Loading...</p>
          ) : !loggedIn ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border px-3 py-2 text-sm"
              />
              <Button className="w-fit" onClick={login}>
                Log in
              </Button>
            </>
          ) : (
            <>
              <p>Logged in as {userEmail}</p>
              <Button className="w-fit" variant="secondary" onClick={logout}>
                Log out
              </Button>
            </>
          )}
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </div>
    </div>
  )
}
