import type { MassScheduleExceptionsDAF } from '@/services/database/mass-schedule-exceptions-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface DeleteMassScheduleExceptionUseCaseRequest {
  exceptionId: string;
}

export class DeleteMassScheduleExceptionUseCase {
  constructor(private massScheduleExceptionsDaf: MassScheduleExceptionsDAF) {}

  async execute({
    exceptionId,
  }: DeleteMassScheduleExceptionUseCaseRequest): Promise<void> {
    const exception =
      await this.massScheduleExceptionsDaf.findById(exceptionId);

    if (!exception) {
      throw new ResourceNotFoundError();
    }

    await this.massScheduleExceptionsDaf.delete(exceptionId);
  }
}
