import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { api } from "@/lib/api"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [counter, setCounter] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const visit = async () => {
    setError(null)
    try {
      const res = await api.index.$get()
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCounter(data.counter)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const read = async () => {
    setError(null)
    try {
      const res = await api.read.$get()
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCounter(data.counter)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button className="w-fit" onClick={visit}>
              Visit (increments)
            </Button>
            <Button className="w-fit" variant="secondary" onClick={read}>
              Read
            </Button>
          </div>
          {counter !== null && <p>Counter: {counter}</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
        </div>
      </div>
    </div>
  )
}
