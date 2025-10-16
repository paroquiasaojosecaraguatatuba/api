import { getAppContext } from '@/http/utils/getAppContext';
import { getCookie, setCookie } from 'hono/cookie';
import {
  createAccessToken,
  verifyAccessTokenSafe,
} from 'serverless-crypto-utils/access-token';

export const refresh: ControllerFn = async (c) => {
  const { user, t } = getAppContext(c);

  const refreshToken = getCookie(c, 'refreshToken');

  if (!refreshToken) {
    return c.json(
      {
        error: t('required-refresh-token'),
      },
      401,
    );
  }

  const refreshResult = await verifyAccessTokenSafe({
    accessToken: refreshToken,
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
  });

  if (!refreshResult.success) {
    return c.json(
      {
        error: t('invalid-refresh-token-or-expired'),
      },
      401,
    );
  }

  const token = await createAccessToken({
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
    payload: {
      user,
    },
    expiresInSeconds: 3600, // 1 hour
  });

  const newRefreshToken = await createAccessToken({
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
    payload: {
      user,
    },
    expiresInSeconds: 60 * 60 * 24 * 7, // 7 days
  });

  setCookie(c, 'refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return c.json({ token });
};
