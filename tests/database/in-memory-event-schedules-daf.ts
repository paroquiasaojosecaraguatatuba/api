import type { EventSchedule } from '@/entities/event-schedule';
import type { EventSchedulesDAF } from '@/services/database/event-schedules-daf';

export class InMemoryEventSchedulesDAF implements EventSchedulesDAF {
  public eventSchedules: EventSchedule[] = [];

  async findById(id: string): Promise<EventSchedule | null> {
    const eventSchedule = this.eventSchedules.find(
      (schedule) => schedule.id === id,
    );

    if (!eventSchedule) {
      return null;
    }

    return eventSchedule;
  }

  async findMany(data: { from: string; to: string }): Promise<EventSchedule[]> {
    return this.eventSchedules.filter(
      (schedule) =>
        schedule.eventDate >= data.from && schedule.eventDate <= data.to,
    );
  }

  async create(eventSchedule: EventSchedule): Promise<void> {
    this.eventSchedules.push(eventSchedule);
  }

  async update(eventSchedule: EventSchedule): Promise<void> {
    const index = this.eventSchedules.findIndex(
      (schedule) => schedule.id === eventSchedule.id,
    );

    if (index >= 0) {
      this.eventSchedules[index] = eventSchedule;
    }
  }

  async delete(id: string): Promise<void> {
    this.eventSchedules = this.eventSchedules.filter(
      (schedule) => schedule.id !== id,
    );
  }
}
