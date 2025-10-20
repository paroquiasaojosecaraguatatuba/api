import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteClergyUseCase } from '@/use-cases/factories/clergy/make-delete-clergy-use-case';

export const deleteClergy: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id } = params;

  const deleteClergyUseCase = makeDeleteClergyUseCase(c);

  try {
    await deleteClergyUseCase.execute({ clergyId: id });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-clergy-not-found') }, 404);
    }

    throw err;
  }
};
