import { Context } from "hono"
import { Bindings } from "hono/types"

export const healthCheck = (c: Context<{Bindings: Bindings}>) => {
  return c.text('The API is running!')
}