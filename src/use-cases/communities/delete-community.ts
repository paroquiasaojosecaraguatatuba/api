import type { CommunitiesDAF } from '@/services/database/communities-daf';

interface DeleteCommunityUseCaseRequest {
  communityId: string;
}

export class DeleteCommunityUseCase {
  constructor(private communitiesDaf: CommunitiesDAF) {}

  async execute({ communityId }: DeleteCommunityUseCaseRequest): Promise<void> {
    await this.communitiesDaf.delete(communityId);
  }
}
