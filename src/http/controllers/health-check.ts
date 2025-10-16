import { Context } from "hono"

export const healthCheck = (c: Context<{Bindings: Bindings}>) => {
  return c.text('The API is running!')
}