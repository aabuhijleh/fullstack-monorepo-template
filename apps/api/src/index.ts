import { Hono } from "hono"
import { cors } from "hono/cors"
import { sign, verify } from "hono/jwt"
import { setCookie, getCookie, deleteCookie } from "hono/cookie"
import type { Context } from "hono"

type Bindings = {
  WEB_ORIGIN: string
  JWT_SECRET: string
}

const ACCESS_TTL = 15 * 60
const REFRESH_TTL = 7 * 24 * 60 * 60

async function generateTokens(sub: string, email: string, secret: string) {
  const now = Math.floor(Date.now() / 1000)
  const [accessToken, refreshToken] = await Promise.all([
    sign({ sub, email, type: "access", exp: now + ACCESS_TTL }, secret),
    sign({ sub, email, type: "refresh", exp: now + REFRESH_TTL }, secret),
  ])
  return { accessToken, refreshToken }
}

function setAuthCookies(
  c: Context,
  tokens: { accessToken: string; refreshToken: string }
) {
  const isSecure = c.env.WEB_ORIGIN.startsWith("https")
  const cookieOpts = {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "None" : "Lax",
  } as const
  setCookie(c, "accessToken", tokens.accessToken, {
    ...cookieOpts,
    path: "/",
    maxAge: ACCESS_TTL,
  })
  setCookie(c, "refreshToken", tokens.refreshToken, {
    ...cookieOpts,
    path: "/auth",
    maxAge: REFRESH_TTL,
  })
}

function clearAuthCookies(c: Context) {
  const isSecure = c.env.WEB_ORIGIN.startsWith("https")
  const cookieOpts = {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "None" : "Lax",
  } as const
  deleteCookie(c, "accessToken", { ...cookieOpts, path: "/" })
  deleteCookie(c, "refreshToken", { ...cookieOpts, path: "/auth" })
}

const routes = new Hono<{ Bindings: Bindings }>()
  .use("*", (c, next) =>
    cors({ origin: c.env.WEB_ORIGIN, credentials: true })(c, next)
  )
  .post("/auth/login", async (c) => {
    const body = await c.req.json<{ email: string; password: string }>()
    if (body.email !== "admin@example.com" || body.password !== "password") {
      return c.json({ error: "Invalid credentials" }, 401)
    }
    const tokens = await generateTokens("1", body.email, c.env.JWT_SECRET)
    setAuthCookies(c, tokens)
    return c.json(tokens)
  })
  .post("/auth/refresh", async (c) => {
    let rt = getCookie(c, "refreshToken")
    if (!rt) {
      try {
        const body = await c.req.json<{ refreshToken?: string }>()
        rt = body.refreshToken
      } catch {
        // no body — web clients send the token via cookie only
      }
    }
    if (!rt) {
      return c.json({ error: "No refresh token" }, 401)
    }
    try {
      const payload = await verify(rt, c.env.JWT_SECRET, "HS256")
      if (payload.type !== "refresh") {
        return c.json({ error: "Invalid token type" }, 401)
      }
      const tokens = await generateTokens(
        payload.sub as string,
        payload.email as string,
        c.env.JWT_SECRET
      )
      setAuthCookies(c, tokens)
      return c.json(tokens)
    } catch {
      return c.json({ error: "Invalid refresh token" }, 401)
    }
  })
  .post("/auth/logout", (c) => {
    clearAuthCookies(c)
    return c.json({ ok: true })
  })
  .use("/protected/*", async (c, next) => {
    const header = c.req.header("Authorization")
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : getCookie(c, "accessToken")
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401)
    }
    try {
      const payload = await verify(token, c.env.JWT_SECRET, "HS256")
      if (payload.type !== "access") {
        return c.json({ error: "Invalid token type" }, 401)
      }
      c.set("jwtPayload" as never, payload as never)
      await next()
    } catch {
      return c.json({ error: "Unauthorized" }, 401)
    }
  })
  .get("/protected/me", (c) => {
    const payload = c.get("jwtPayload" as never) as { sub: string; email: string }
    return c.json({ email: payload.email })
  })

export type AppType = typeof routes
export default routes
