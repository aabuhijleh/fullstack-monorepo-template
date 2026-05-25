import { hc } from 'hono/client'
import type { AppType } from 'api'

export const createApiClient = (baseUrl: string) =>
  hc<AppType>(baseUrl, { init: { credentials: 'include' } })
export type ApiClient = ReturnType<typeof createApiClient>
