import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { D1MassSchedulesDAF } from '@/services/database/d1/d1-mass-schedules-daf';
import { CreateMassScheduleUseCase } from '@/use-cases/mass-schedules/create-mass-schedule';

export function makeCreateMassSchedule(c: DomainContext) {
  const massSchedulesDaf = new D1MassSchedulesDAF(c.env.DB);
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);

  const useCase = new CreateMassScheduleUseCase(
    massSchedulesDaf,
    communitiesDaf,
  );

  return useCase;
}
