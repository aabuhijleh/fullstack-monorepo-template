import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { CookieStore, Session, sessionMiddleware } from 'hono-sessions'

type SessionDataTypes = {
  counter: number
}

type Bindings = {
  WEB_ORIGIN: string
  SESSION_ENCRYPTION_KEY: string
}

type Env = {
  Bindings: Bindings
  Variables: {
    session: Session<SessionDataTypes>
    session_key_rotation: boolean
  }
}

const store = new CookieStore()

const routes = new Hono<Env>()
  .use('*', (c, next) =>
    cors({
      origin: c.env.WEB_ORIGIN,
      credentials: true,
    })(c, next),
  )
  .use('*', (c, next) =>
    sessionMiddleware({
      store,
      encryptionKey: c.env.SESSION_ENCRYPTION_KEY,
      expireAfterSeconds: 900,
      cookieOptions: {
        sameSite: 'Lax',
        path: '/',
        httpOnly: true,
      },
    })(c, next),
  )
  .get('/', (c) => {
    const session = c.get('session')
    const counter = (session.get('counter') || 0) + 1
    session.set('counter', counter)
    return c.json({ counter })
  })
  .get('/read', (c) => {
    const session = c.get('session')
    session.touch()
    return c.json({ counter: session.get('counter') ?? 0 })
  })

export type AppType = typeof routes
export default routes
