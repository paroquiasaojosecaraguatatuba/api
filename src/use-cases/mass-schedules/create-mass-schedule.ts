import type { MassSchedule } from '@/entities/mass-schedule';
import type { CommunitiesDAF } from '@/services/database/communities-daf';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { makeId } from '../factories/make-id';

interface CreateMassScheduleUseCaseRequest {
  communityId: string;
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

interface CreateMassScheduleUseCaseResponse {
  massSchedule: MassSchedule;
}

export class CreateMassScheduleUseCase {
  constructor(
    private massSchedulesDaf: MassSchedulesDAF,
    private communitiesDaf: CommunitiesDAF,
  ) {}

  async execute({
    communityId,
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
  }: CreateMassScheduleUseCaseRequest): Promise<CreateMassScheduleUseCaseResponse> {
    const community = await this.communitiesDaf.findById(communityId);

    if (!community) {
      throw new ResourceNotFoundError('COMMUNITY_NOT_FOUND');
    }

    const massScheduleId = makeId();

    const massSchedule = {
      id: massScheduleId,
      communityId,
      title,
      type,
      description,
      isPrecept,
      recurrenceType,
      dayOfWeek,
      dayOfMonth,
      weekOfMonth,
      monthOfYear,
      active: startDate ? new Date(startDate) <= new Date() : true,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
      times: times.map((time) => ({
        id: makeId(),
        scheduleId: massScheduleId,
        time,
      })),
    };

    await this.massSchedulesDaf.create(massSchedule);

    return {
      massSchedule,
    };
  }
}
