import type { Context, Next } from "hono";

export const parseJSON = async (
  c: Context<{ Bindings: Bindings }>,
  next: Next
) => {
  try {
    if (
      c.req.method === "POST" ||
      c.req.method === "PUT" ||
      c.req.method === "PATCH"
    ) {
      const body = await c.req.json();
      c.env.data = body;
    }

    return await next();
  } catch (error) {
    return c.json(
      { error: "Erro ao obter corpo JSON!" },
      500
    );
  }
};