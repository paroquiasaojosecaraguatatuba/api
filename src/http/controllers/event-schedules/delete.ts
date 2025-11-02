import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteEventScheduleUseCase } from '@/use-cases/factories/event-schedules/make-delete-event-schedule-use-case';

export const deleteEventSchedule: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id: eventScheduleId } = params;

  try {
    const useCase = makeDeleteEventScheduleUseCase(c);

    await useCase.execute({
      eventScheduleId,
    });

    return c.json(204);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-event-schedule-not-found') }, 404);
    }

    throw error;
  }
};
