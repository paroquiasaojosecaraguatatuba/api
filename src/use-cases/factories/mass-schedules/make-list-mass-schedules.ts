import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { D1MassSchedulesDAF } from '@/services/database/d1/d1-mass-schedules-daf';
import { ListMassSchedulesUseCase } from '@/use-cases/mass-schedules/list-mass-schedules';

export function makeListMassSchedules(c: DomainContext) {
  const massSchedulesDaf = new D1MassSchedulesDAF(c.env.DB);
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);

  const useCase = new ListMassSchedulesUseCase(
    massSchedulesDaf,
    communitiesDaf,
  );

  return useCase;
}
