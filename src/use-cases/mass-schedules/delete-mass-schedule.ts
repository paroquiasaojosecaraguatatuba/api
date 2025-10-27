import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface DeleteMassScheduleUseCaseRequest {
  massScheduleId: string;
}

export class DeleteMassScheduleUseCase {
  constructor(private massSchedulesDaf: MassSchedulesDAF) {}

  async execute({
    massScheduleId,
  }: DeleteMassScheduleUseCaseRequest): Promise<void> {
    const massSchedule = await this.massSchedulesDaf.findById(massScheduleId);

    if (!massSchedule) {
      throw new ResourceNotFoundError('MASS_SCHEDULE_NOT_FOUND');
    }

    await this.massSchedulesDaf.delete(massScheduleId);
  }
}
