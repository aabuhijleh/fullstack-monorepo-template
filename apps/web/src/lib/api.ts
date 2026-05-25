import { createApiClient } from "@workspace/api-client"

const BASE_URL = import.meta.env.VITE_API_URL

const authFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, { ...init, credentials: "include" })
  if (res.status !== 401) return res

  const url = input instanceof Request ? input.url : String(input)
  if (url.includes("/auth/")) return res

  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
  if (!refreshRes.ok) return res

  return fetch(input, { ...init, credentials: "include" })
}

export const api = createApiClient(BASE_URL, { fetch: authFetch })
