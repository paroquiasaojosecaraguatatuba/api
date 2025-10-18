import { getAppContext } from '@/http/utils/getAppContext';
import { makeDeleteCommunityUseCase } from '@/use-cases/factories/makeDeleteCommunityUseCase';

export const deleteCommunity: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id } = params;

  const deleteCommunityUseCase = makeDeleteCommunityUseCase(c);

  await deleteCommunityUseCase.execute({ communityId: id });

  return c.json({ message: t('community-deleted-successfully') });
};
