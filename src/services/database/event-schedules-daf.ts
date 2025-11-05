import type { EventSchedule } from '@/entities/event-schedule';

export interface EventSchedulesDAF {
  findById(id: string): Promise<EventSchedule | null>;
  findMany(data: { from: string; to: string }): Promise<EventSchedule[]>;
  create(eventSchedule: EventSchedule): Promise<void>;
  update(eventSchedule: EventSchedule): Promise<void>;
  delete(id: string): Promise<void>;
}
