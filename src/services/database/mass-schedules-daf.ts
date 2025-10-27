import type { MassSchedule } from '@/entities/mass-schedule';

export interface MassSchedulesDAF {
  findById(massScheduleId: string): Promise<MassSchedule | null>;
  findMany(): Promise<MassSchedule[]>;
  create(massSchedule: MassSchedule): Promise<void>;
  save(massSchedule: MassSchedule): Promise<void>;
  delete(massScheduleId: string): Promise<void>;
}
