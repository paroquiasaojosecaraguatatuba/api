import type { MassSchedule } from '@/entities/mass-schedule';
import type { CommunitiesDAF } from '@/services/database/communities-daf';
import type { MassSchedulesDAF } from '@/services/database/mass-schedules-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface ListMassSchedulesUseCaseRequest {
  communityId: string;
}

interface ListMassSchedulesUseCaseResponse {
  massSchedules: MassSchedule[];
}

export class ListMassSchedulesUseCase {
  constructor(
    private massSchedulesDaf: MassSchedulesDAF,
    private communitiesDaf: CommunitiesDAF,
  ) {}

  async execute({
    communityId,
  }: ListMassSchedulesUseCaseRequest): Promise<ListMassSchedulesUseCaseResponse> {
    const community = await this.communitiesDaf.findById(communityId);

    if (!community) {
      throw new ResourceNotFoundError('COMMUNITY_NOT_FOUND');
    }

    const massSchedules = await this.massSchedulesDaf.findMany({ communityId });

    return { massSchedules };
  }
}
