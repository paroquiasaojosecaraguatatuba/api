import type { MassSchedule } from '@/entities/mass-schedule';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';

interface ListMassSchedulesUseCaseResponse {
  massSchedules: MassSchedule[];
}

export class ListMassSchedulesUseCase {
  constructor(private massSchedulesDaf: MassSchedulesDAF) {}

  async execute(): Promise<ListMassSchedulesUseCaseResponse> {
    const massSchedules = await this.massSchedulesDaf.findMany();

    return { massSchedules };
  }
}
