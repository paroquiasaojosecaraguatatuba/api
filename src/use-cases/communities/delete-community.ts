import type { CommunitiesDAF } from '@/services/database/communities-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface DeleteCommunityUseCaseRequest {
  communityId: string;
}

export class DeleteCommunityUseCase {
  constructor(private communitiesDaf: CommunitiesDAF) {}

  async execute({ communityId }: DeleteCommunityUseCaseRequest): Promise<void> {
    const community = await this.communitiesDaf.findById(communityId);

    if (!community) {
      throw new ResourceNotFoundError();
    }

    await this.communitiesDaf.delete(communityId);
  }
}
