import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeListMassSchedules } from '@/use-cases/factories/mass-schedules/make-list-mass-schedules';

export const listMassSchedules: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id: communityId } = params;

  try {
    const listUseCase = makeListMassSchedules(c);

    const { massSchedules } = await listUseCase.execute({ communityId });

    return c.json({ massSchedules });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-community-not-found') }, 400);
    }

    throw err;
  }
};
