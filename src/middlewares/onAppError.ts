import type { Context } from "hono";
import type { HTTPResponseError } from "hono/types";
import { log } from "../services/log";

export const onAppError = async (
  error: Error | HTTPResponseError,
  c: Context<{Bindings: Bindings}>
) => {
  c.executionCtx.waitUntil(
    log({
      env: c.env,
      data: {
        endpoint: c.req.url,
        method: c.req.method,
        input: c.env.data,
      },
      error,
    })
  );

  return c.json(
    {
      message: 'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    },
    500
  );
};