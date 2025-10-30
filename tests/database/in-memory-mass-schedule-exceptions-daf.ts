import type { MassScheduleException } from '@/entities/mass-schedule-exception';
import type { MassScheduleExceptionsDAF } from '@/services/database/mass-schedule-exceptions-daf';

export class InMemoryMassScheduleExceptionsDAF
  implements MassScheduleExceptionsDAF
{
  public massScheduleExceptions: MassScheduleException[] = [];

  async findUnique(
    scheduleId: string,
    exceptionDate: string,
    startTime: string,
  ): Promise<MassScheduleException | null> {
    const exception = this.massScheduleExceptions.find((exception) => {
      return (
        exception.scheduleId === scheduleId &&
        exception.exceptionDate === exceptionDate &&
        exception.startTime === startTime
      );
    });

    return exception ?? null;
  }

  async findById(id: string): Promise<MassScheduleException | null> {
    const exception = this.massScheduleExceptions.find(
      (exception) => exception.id === id,
    );

    return exception ?? null;
  }

  async findMany({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<MassScheduleException[]> {
    return this.massScheduleExceptions.filter((exception) => {
      return exception.exceptionDate >= from && exception.exceptionDate <= to;
    });
  }

  async create(exception: MassScheduleException): Promise<void> {
    this.massScheduleExceptions.push(exception);
  }

  async delete(id: string): Promise<void> {
    this.massScheduleExceptions = this.massScheduleExceptions.filter(
      (exception) => exception.id !== id,
    );
  }
}
