import type { MassScheduleException } from '@/entities/mass-schedule-exception';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import type { MassScheduleExceptionsDAF } from '@/services/database/mass-schedule-exceptions-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { makeId } from '../factories/make-id';
import { AlreadyExistsError } from '../errors/already-exists-error';

interface CreateMassScheduleExceptionUseCaseRequest {
  scheduleId: string;
  exceptionDate: string;
  startTime: string;
  reason: string;
  userId: string;
}

interface CreateMassScheduleExceptionUseCaseResponse {
  massScheduleException: MassScheduleException;
}

export class CreateMassScheduleExceptionUseCase {
  constructor(
    private massScheduleDaf: MassSchedulesDAF,
    private massScheduleExceptionsDaf: MassScheduleExceptionsDAF,
  ) {}

  async execute({
    scheduleId,
    exceptionDate,
    reason,
    startTime,
    userId,
  }: CreateMassScheduleExceptionUseCaseRequest): Promise<CreateMassScheduleExceptionUseCaseResponse> {
    const massSchedule = await this.massScheduleDaf.findById(scheduleId);

    if (!massSchedule) {
      throw new ResourceNotFoundError();
    }

    const existingException = await this.massScheduleExceptionsDaf.findUnique(
      scheduleId,
      exceptionDate,
      startTime,
    );

    if (existingException) {
      throw new AlreadyExistsError();
    }

    const massScheduleException = {
      id: makeId(),
      scheduleId,
      exceptionDate,
      startTime,
      reason,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    };

    await this.massScheduleExceptionsDaf.create(massScheduleException);

    return {
      massScheduleException,
    };
  }
}
