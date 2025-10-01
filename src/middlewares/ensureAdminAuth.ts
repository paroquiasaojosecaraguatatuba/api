import type { Context, Next } from "hono";
import { verifyAccessTokenSafe } from "serverless-crypto-utils/access-token";

export const ensureAdminAuth = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) => {
  const accessToken = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return c.json({ error: "Acesso negado. Token ausente." }, 401);
  }

  const result = await verifyAccessTokenSafe({
    accessToken,
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
  })

  if (result.success) {
    const data = JSON.parse(result.data);
    c.set("user", data.user);
    return await next();
  } else {
    console.error(`Error ${result.error.code}: ${result.error.message}`);

    return c.json({ error: "Acesso negado. Token inválido ou expirado." }, 401);
  }
};