import type { Community } from '@/entities/community';
import type { MassSchedule } from '@/entities/mass-schedule';
import { EditMassScheduleUseCase } from '@/use-cases/mass-schedules/edit-mass-schedule';
import { InMemoryMassSchedulesDAF } from '@tests/database/in-memory-mass-schedules-daf';
import { makeMassSchedule } from '@tests/factories/make-mass-schedule';
import { beforeEach, describe, expect, it } from 'vitest';

let massSchedulesDaf: InMemoryMassSchedulesDAF;
let sut: EditMassScheduleUseCase;

let massSchedule: MassSchedule;

describe('Edit Mass Schedule Use Case', () => {
  beforeEach(async () => {
    massSchedulesDaf = new InMemoryMassSchedulesDAF();
    sut = new EditMassScheduleUseCase(massSchedulesDaf);

    massSchedule = makeMassSchedule();
    await massSchedulesDaf.create(massSchedule);
  });

  it('should be able to edit a regular weekly mass schedule', async () => {
    const { massSchedule: newMassSchedule } = await sut.execute({
      massScheduleId: massSchedule.id,
      type: 'regular',
      recurrenceType: 'weekly',
      dayOfWeek: 3, // Wednesday
      times: ['09:00', '19:30'],
      isPrecept: false,
    });

    expect(newMassSchedule).toEqual(
      expect.objectContaining({
        id: massSchedule.id,
        type: 'regular',
        recurrenceType: 'weekly',
        times: [
          {
            id: expect.any(String),
            time: '09:00',
            scheduleId: massSchedule.id,
          },
          {
            id: expect.any(String),
            time: '19:30',
            scheduleId: massSchedule.id,
          },
        ],
      }),
    );
  });

  it('should not be able to edit a mass schedule with a non-existing id', async () => {
    await expect(() =>
      sut.execute({
        massScheduleId: 'non-existing-id',
        type: 'regular',
        recurrenceType: 'weekly',
        dayOfWeek: 2,
        times: ['18:00'],
        isPrecept: false,
      }),
    ).rejects.toThrowError('MASS_SCHEDULE_NOT_FOUND');
  });
});
