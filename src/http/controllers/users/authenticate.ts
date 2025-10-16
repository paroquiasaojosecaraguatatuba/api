import { useLoginSchema } from '@/schemas/useLoginSchema';
import { getAppContext } from '@/http/utils/getAppContext';
import { createAccessToken } from 'serverless-crypto-utils';
import { makeAuthenticateUseCase } from '@/use-cases/factories/makeAuthenticateUseCase';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { setCookie } from 'hono/cookie';

export const authenticate: ControllerFn = async (c) => {
  const { inputs, t } = getAppContext(c);

  const validationSchema = useLoginSchema(t);

  const { email, password } = validationSchema.parse(inputs);

  try {
    const authenticateUseCase = makeAuthenticateUseCase(c);
    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await createAccessToken({
      encryptionSecret: c.env.ENCRYPTION_SECRET,
      signingSecret: c.env.SIGNING_SECRET,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      expiresInSeconds: 3600, // 1 hour
    });

    const refreshToken = await createAccessToken({
      encryptionSecret: c.env.ENCRYPTION_SECRET,
      signingSecret: c.env.SIGNING_SECRET,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      expiresInSeconds: 60 * 60 * 24 * 7, // 7 days
    });

    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return c.json({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return c.json({ message: t('invalid-email-or-password') }, 400);
    }

    throw err;
  }
};
