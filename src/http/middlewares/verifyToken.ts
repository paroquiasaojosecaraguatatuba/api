import type { Context, Next } from 'hono';
import { verifyAccessTokenSafe } from 'serverless-crypto-utils/access-token';
import { getAppContext } from '../utils/getAppContext';

export const verifyToken = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next,
) => {
  const { t } = getAppContext(c);

  const accessToken = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return c.json({ error: t('invalid-token-or-expired') }, 401);
  }

  const result = await verifyAccessTokenSafe({
    accessToken,
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
  });

  if (result.success) {
    const data = JSON.parse(result.data);
    c.set('user', data.user);
    return await next();
  }

  console.error(`Error ${result.error.code}: ${result.error.message}`);

  return c.json({ error: t('invalid-token-or-expired') }, 401);
};
