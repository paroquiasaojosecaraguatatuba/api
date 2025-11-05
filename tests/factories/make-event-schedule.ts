import type { EventSchedule } from '@/entities/event-schedule';
import { makeId } from '@/use-cases/factories/make-id';
import { faker } from '@faker-js/faker';

export function makeEventSchedule(
  overrides?: Partial<EventSchedule>,
): EventSchedule {
  const eventScheduleId = makeId();

  const eventDate = faker.date.soon({ days: 30 }).toISOString().split('T')[0];

  return {
    id: eventScheduleId,
    communityId: makeId(),
    title: faker.lorem.sentence(),
    type: 'anniversary',
    createdAt: new Date().toISOString(),
    eventDate,
    startTime: '10:00',
    ...overrides,
  };
}
