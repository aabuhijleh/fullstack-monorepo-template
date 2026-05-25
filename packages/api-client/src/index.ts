import { hc } from "hono/client"
import type { ClientRequestOptions } from "hono/client"
import type { AppType } from "api"

export const createApiClient = (
  baseUrl: string,
  options?: ClientRequestOptions
) => hc<AppType>(baseUrl, options)

export type ApiClient = ReturnType<typeof createApiClient>
