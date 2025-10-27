import { getAppContext } from '@/http/utils/getAppContext';
import { makeDeleteMassSchedule } from '@/use-cases/factories/mass-schedules/make-delete-mass-schedule';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

export const deleteMassSchedule: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id: massScheduleId } = params;

  try {
    const deleteUseCase = makeDeleteMassSchedule(c);

    await deleteUseCase.execute({
      massScheduleId,
    });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-schedule-not-found') }, 400);
    }

    throw err;
  }
};
