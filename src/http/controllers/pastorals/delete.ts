import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeletePastoralUseCase } from '@/use-cases/factories/pastorals/make-delete-pastoral-use-case';

export const deletePastoral: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id } = params;

  const deletePastoralUseCase = makeDeletePastoralUseCase(c);

  try {
    await deletePastoralUseCase.execute({ pastoralId: id });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-pastoral-not-found') }, 404);
    }

    throw err;
  }
};
