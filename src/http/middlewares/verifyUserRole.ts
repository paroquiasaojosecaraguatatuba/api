import type { Context, Next } from 'hono';
import { getAppContext } from '../utils/getAppContext';

export function verifyUserRole(roleToVerify: 'admin' | 'user' | 'viewer') {
  return async (
    c: Context<{ Bindings: Bindings; Variables: Variables }>,
    next: Next,
  ) => {
    const { user, t } = getAppContext(c);

    if (user.role !== roleToVerify) {
      return c.json({ message: t('unauthorized') }, 401);
    }

    await next();
  };
}
