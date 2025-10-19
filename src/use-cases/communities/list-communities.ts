import type { Community } from '@/entities/community';
import type { CommunitiesDAF } from '@/services/database/communities-daf';

interface ListCommunitiesUseCaseResponse {
  communities: Community[];
}

export class ListCommunitiesUseCase {
  constructor(private communitiesDaf: CommunitiesDAF) {}

  async execute(): Promise<ListCommunitiesUseCaseResponse> {
    const communities = await this.communitiesDaf.findAll();

    return { communities };
  }
}
