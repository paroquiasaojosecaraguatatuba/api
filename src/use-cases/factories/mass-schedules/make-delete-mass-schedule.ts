import { D1MassSchedulesDAF } from '@/services/database/d1/d1-mass-schedules-daf';
import { DeleteMassScheduleUseCase } from '@/use-cases/mass-schedules/delete-mass-schedule';

export function makeDeleteMassSchedule(c: DomainContext) {
  const massSchedulesDaf = new D1MassSchedulesDAF(c.env.DB);

  const useCase = new DeleteMassScheduleUseCase(massSchedulesDaf);

  return useCase;
}
