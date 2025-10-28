import type { MassSchedule } from '@/entities/mass-schedule';
import { makeId } from '@/use-cases/factories/make-id';
import { faker } from '@faker-js/faker';

export function makeMassSchedule(
  overrides?: Partial<MassSchedule>,
): MassSchedule {
  const massScheduleId = makeId();

  return {
    id: massScheduleId,
    communityId: makeId(),
    type: 'ordinary',
    isPrecept: false,
    recurrenceType: 'weekly',
    dayOfWeek: 0,
    active: true,
    createdAt: new Date().toISOString(),
    times: [
      {
        id: makeId(),
        startTime: '09:00',
        endTime: '10:00',
        scheduleId: massScheduleId,
      },
    ],
    ...overrides,
  };
}
