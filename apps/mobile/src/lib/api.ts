import * as SecureStore from "expo-secure-store"
import { createApiClient } from "@workspace/api-client"

const ACCESS_KEY = "accessToken"
const REFRESH_KEY = "refreshToken"
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8787"

let accessToken: string | null = null
let refreshToken: string | null = null

function isExpired(token: string): boolean {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(b64))
    return payload.exp * 1000 < Date.now() - 30_000
  } catch {
    return true
  }
}

async function refresh(): Promise<string | null> {
  if (!refreshToken || isExpired(refreshToken)) {
    await clearTokens()
    return null
  }
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
      await clearTokens()
      return null
    }
    const data = (await res.json()) as {
      accessToken: string
      refreshToken: string
    }
    await saveTokens(data.accessToken, data.refreshToken)
    return accessToken
  } catch {
    return null
  }
}

export async function saveTokens(access: string, rt: string) {
  accessToken = access
  refreshToken = rt
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, access),
    SecureStore.setItemAsync(REFRESH_KEY, rt),
  ])
}

export async function loadTokens(): Promise<boolean> {
  const [a, r] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ])
  accessToken = a
  refreshToken = r
  return !!a
}

export async function clearTokens() {
  accessToken = null
  refreshToken = null
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ])
}

async function getToken(): Promise<string | null> {
  if (!accessToken) return null
  if (!isExpired(accessToken)) return accessToken
  return refresh()
}

export const api = createApiClient(BASE_URL, {
  headers: async () => {
    const token = await getToken()
    return token
      ? { Authorization: `Bearer ${token}` }
      : ({} as Record<string, string>)
  },
})
