import type { Next } from "hono";
import { log } from "../services/log";
import { getDAF } from "../services/database";
import { getAppContext } from "@/utils/getAppContext";

export const withD1Database = async (c: DomainContext, next: Next) => {
  const {t} = getAppContext(c)

  if (!c.env.DB) {
    c.executionCtx.waitUntil(
      log({
        env: c.env,
        data: {
          endpoint: c.req.url,
          method: c.req.method,
          error_type: "D1_BINDING_NOT_FOUND",
        },
        error: {
          description: "D1 database binding not found in environment",
        },
      })
    );

    return c.json({ error: t("error-database-connection") }, 500);
  }

  // 2) D1 suporta transações via batch() - rollback automático se alguma query falhar
  // Simplesmente disponibiliza o DAF no contexto
  try {
    c.set("daf", getDAF());

    await next();
  } catch (err) {
    // D1 batch() já faz rollback automático se configurado
    // Apenas propaga o erro para o app.onError
    throw err;
  }
};