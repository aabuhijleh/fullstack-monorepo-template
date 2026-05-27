import { createServerFn } from "@tanstack/react-start"

const AUTH_TOKEN_COOKIE = "convex_auth_token"
const REFRESH_TOKEN_COOKIE = "convex_auth_refresh_token"
const COOKIE_OPTS = "path=/; max-age=31536000; SameSite=Lax"

const REQUIRED_LIFETIME_MS = 60_000
const MIN_REQUIRED_LIFETIME_MS = 10_000

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split(".")[1]
    return JSON.parse(atob(payload)) as { exp?: number; iat?: number }
  } catch {
    return null
  }
}

function isTokenFresh(token: string): boolean {
  const decoded = decodeJwtPayload(token)
  if (!decoded?.exp) return false

  const expMs = decoded.exp * 1000
  const iatMs = (decoded.iat ?? decoded.exp) * 1000
  const totalLifetime = expMs - iatMs
  const requiredLifetime = Math.min(
    REQUIRED_LIFETIME_MS,
    Math.max(MIN_REQUIRED_LIFETIME_MS, totalLifetime / 10)
  )

  return expMs > Date.now() + requiredLifetime
}

export const getAuthToken = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getCookie, setCookie, deleteCookie } =
      await import("@tanstack/react-start/server")

    const token = getCookie(AUTH_TOKEN_COOKIE) ?? null
    const refreshToken = getCookie(REFRESH_TOKEN_COOKIE) ?? null

    if (!token && !refreshToken) return null

    if (token && isTokenFresh(token)) return token

    if (refreshToken) {
      try {
        const { ConvexHttpClient } = await import("convex/browser")
        const { api } = await import("@workspace/backend/api")
        const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!)
        const result: {
          tokens?: { token: string; refreshToken: string } | null
        } = await client.action(api.auth.signIn, { refreshToken })

        if (result.tokens) {
          setCookie(AUTH_TOKEN_COOKIE, result.tokens.token, {
            path: "/",
            maxAge: 31536000,
            sameSite: "lax",
          })
          setCookie(REFRESH_TOKEN_COOKIE, result.tokens.refreshToken, {
            path: "/",
            maxAge: 31536000,
            sameSite: "lax",
          })
          return result.tokens.token
        }
      } catch {
        // Refresh failed — fall through to clear cookies
      }
    }

    deleteCookie(AUTH_TOKEN_COOKIE)
    deleteCookie(REFRESH_TOKEN_COOKIE)
    return null
  }
)

export function createCookieSyncStorage() {
  return {
    getItem(key: string) {
      return localStorage.getItem(key)
    },
    setItem(key: string, value: string) {
      localStorage.setItem(key, value)
      if (key.includes("__convexAuthJWT")) {
        document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(value)}; ${COOKIE_OPTS}`
      }
      if (key.includes("__convexAuthRefreshToken")) {
        document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(value)}; ${COOKIE_OPTS}`
      }
    },
    removeItem(key: string) {
      localStorage.removeItem(key)
      if (key.includes("__convexAuthJWT")) {
        document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`
      }
      if (key.includes("__convexAuthRefreshToken")) {
        document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`
      }
    },
  }
}
