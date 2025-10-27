import { getAppContext } from '@/http/utils/getAppContext';
import { makeCreateMassSchedule } from '@/use-cases/factories/mass-schedules/make-create-mass-schedule';
import { useMassScheduleSchema } from '@/schemas/use-mass-schedule-schema';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

export const createMassSchedule: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const {
    communityId,
    title,
    description,
    recurrenceType,
    type,
    isPrecept,
    times,
    dayOfMonth,
    dayOfWeek,
    endDate,
    monthOfYear,
    startDate,
    weekOfMonth,
  } = useMassScheduleSchema(t).parse(inputs);

  try {
    const createUseCase = makeCreateMassSchedule(c);

    const { massSchedule } = await createUseCase.execute({
      communityId,
      title,
      description,
      recurrenceType,
      type,
      isPrecept,
      times,
      dayOfMonth,
      dayOfWeek,
      endDate,
      monthOfYear,
      startDate,
      weekOfMonth,
    });

    return c.json({ massSchedule }, 201);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-community-not-found') }, 400);
    }

    throw err;
  }
};
