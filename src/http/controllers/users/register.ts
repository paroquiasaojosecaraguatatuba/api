import { useUserSchema } from '@/schemas/useUserSchema';
import { getAppContext } from '@/http/utils/getAppContext';
import { makeRegisterUseCase } from '@/use-cases/factories/makeRegisterUseCase';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export const register: ControllerFn = async (c) => {
  const { t, inputs } = getAppContext(c);

  const validationSchema = useUserSchema(t);

  const { email, password, role } = validationSchema.parse(inputs);

  try {
    const registerUseCase = makeRegisterUseCase(c);

    const { user } = await registerUseCase.execute({ email, password, role });

    return c.json({ user });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return c.json({ message: t('error-email-already-exists') }, 409);
    }

    throw err;
  }
};
