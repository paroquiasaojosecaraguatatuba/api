import type { MassSchedule } from '@/entities/mass-schedule';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';

export class InMemoryMassSchedulesDAF implements MassSchedulesDAF {
  public massSchedules: MassSchedule[] = [];

  async findById(massScheduleId: string): Promise<MassSchedule | null> {
    const massSchedule = this.massSchedules.find(
      (massSchedule) => massSchedule.id === massScheduleId,
    );

    return massSchedule || null;
  }

  async findMany(): Promise<MassSchedule[]> {
    return this.massSchedules;
  }

  async findAll(): Promise<MassSchedule[]> {
    return this.massSchedules;
  }

  async create(massSchedule: MassSchedule): Promise<void> {
    this.massSchedules.push(massSchedule);
  }

  async save(massSchedule: MassSchedule): Promise<void> {
    const index = this.massSchedules.findIndex(
      (ms) => ms.id === massSchedule.id,
    );

    if (index !== -1) {
      this.massSchedules[index] = massSchedule;
    }
  }

  async delete(massScheduleId: string): Promise<void> {
    this.massSchedules = this.massSchedules.filter(
      (massSchedule) => massSchedule.id !== massScheduleId,
    );
  }
}
