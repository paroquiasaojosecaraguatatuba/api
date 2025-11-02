import { D1EventSchedulesDAF } from '@/services/database/d1/d1-event-schedules-daf';
import { DeleteEventScheduleUseCase } from '@/use-cases/event-schedules/delete-event-schedule';

export function makeDeleteEventScheduleUseCase(c: DomainContext) {
  const eventSchedulesDaf = new D1EventSchedulesDAF(c.env.DB);

  const useCase = new DeleteEventScheduleUseCase(eventSchedulesDaf);

  return useCase;
}
