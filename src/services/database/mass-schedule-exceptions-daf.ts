import type { MassScheduleException } from '@/entities/mass-schedule-exception';

export interface MassScheduleExceptionsDAF {
  findUnique(
    scheduleId: string,
    exceptionDate: string,
    startTime: string,
  ): Promise<MassScheduleException | null>;
  findById(id: string): Promise<MassScheduleException | null>;
  findMany(data: {
    from: string;
    to: string;
  }): Promise<MassScheduleException[]>;
  create(exception: MassScheduleException): Promise<void>;
  delete(id: string): Promise<void>;
}
