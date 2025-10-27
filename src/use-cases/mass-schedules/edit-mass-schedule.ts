import type { MassSchedule } from '@/entities/mass-schedule';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { makeId } from '../factories/make-id';

interface EditMassScheduleUseCaseRequest {
  massScheduleId: string;
  title?: string;
  type: 'regular' | 'devotional' | 'solemnity';
  description?: string;
  isPrecept: boolean;
  recurrenceType: 'weekly' | 'monthly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  weekOfMonth?: number;
  monthOfYear?: number;
  startDate?: string;
  endDate?: string;
  times: string[]; // Array de horários no formato "HH:MM"
}

interface EditMassScheduleUseCaseResponse {
  massSchedule: MassSchedule;
}

export class EditMassScheduleUseCase {
  constructor(private massSchedulesDaf: MassSchedulesDAF) {}

  async execute({
    massScheduleId,
    title,
    type,
    description,
    isPrecept,
    recurrenceType,
    dayOfWeek,
    dayOfMonth,
    weekOfMonth,
    monthOfYear,
    startDate,
    endDate,
    times,
  }: EditMassScheduleUseCaseRequest): Promise<EditMassScheduleUseCaseResponse> {
    const massSchedule = await this.massSchedulesDaf.findById(massScheduleId);

    if (!massSchedule) {
      throw new ResourceNotFoundError('MASS_SCHEDULE_NOT_FOUND');
    }

    massSchedule.title = title;
    massSchedule.type = type;
    massSchedule.description = description;
    massSchedule.isPrecept = isPrecept;
    massSchedule.recurrenceType = recurrenceType;
    massSchedule.dayOfWeek = dayOfWeek;
    massSchedule.dayOfMonth = dayOfMonth;
    massSchedule.weekOfMonth = weekOfMonth;
    massSchedule.monthOfYear = monthOfYear;
    massSchedule.startDate = startDate;
    massSchedule.endDate = endDate;
    massSchedule.times = times.map((time) => ({
      id: makeId(),
      scheduleId: massSchedule.id,
      time,
    }));

    await this.massSchedulesDaf.save(massSchedule);

    return {
      massSchedule,
    };
  }
}
