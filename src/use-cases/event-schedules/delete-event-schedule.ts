import type { EventSchedulesDAF } from '@/services/database/event-schedules-daf';

interface DeleteEventScheduleUseCaseRequest {
  eventScheduleId: string;
}

export class DeleteEventScheduleUseCase {
  constructor(private eventSchedulesDaf: EventSchedulesDAF) {}

  async execute({
    eventScheduleId,
  }: DeleteEventScheduleUseCaseRequest): Promise<void> {
    await this.eventSchedulesDaf.delete(eventScheduleId);
  }
}
