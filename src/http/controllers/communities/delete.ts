import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteCommunityUseCase } from '@/use-cases/factories/makeDeleteCommunityUseCase';

export const deleteCommunity: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id } = params;

  const deleteCommunityUseCase = makeDeleteCommunityUseCase(c);

  try {
    await deleteCommunityUseCase.execute({ communityId: id });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-community-not-found') }, 404);
    }

    throw err;
  }
};
