import { getAppContext } from '@/http/utils/getAppContext';
import { useEventScheduleSchema } from '@/schemas/use-event-schedule-schema';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeEditEventScheduleUseCase } from '@/use-cases/factories/event-schedules/make-edit-event-schedule-use-case';

export const editEventSchedule: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const {
    communityId,
    eventDate,
    startTime,
    title,
    type,
    customLocation,
    endTime,
    orientations,
  } = useEventScheduleSchema(t).parse(inputs);

  const { id: eventScheduleId } = params;

  try {
    const useCase = makeEditEventScheduleUseCase(c);

    const { eventSchedule } = await useCase.execute({
      eventScheduleId,
      communityId,
      eventDate,
      startTime,
      title,
      type,
      customLocation,
      endTime,
      orientations,
    });

    return c.json({ eventSchedule }, 201);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-community-not-found') }, 404);
    }

    throw error;
  }
};
