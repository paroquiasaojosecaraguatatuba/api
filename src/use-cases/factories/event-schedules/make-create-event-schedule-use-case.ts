import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { D1EventSchedulesDAF } from '@/services/database/d1/d1-event-schedules-daf';
import { CreateEventScheduleUseCase } from '@/use-cases/event-schedules/create-event-schedule';

export function makeCreateEventScheduleUseCase(c: DomainContext) {
  const eventSchedulesDaf = new D1EventSchedulesDAF(c.env.DB);
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);

  const useCase = new CreateEventScheduleUseCase(
    eventSchedulesDaf,
    communitiesDaf,
  );

  return useCase;
}
