import { D1MassSchedulesDAF } from '@/services/database/d1/d1-mass-schedules-daf';
import { EditMassScheduleUseCase } from '@/use-cases/mass-schedules/edit-mass-schedule';

export function makeEditMassSchedule(c: DomainContext) {
  const massSchedulesDaf = new D1MassSchedulesDAF(c.env.DB);

  const useCase = new EditMassScheduleUseCase(massSchedulesDaf);

  return useCase;
}
