import { ulid } from 'serverless-crypto-utils/id-generation';
import type { Community } from '@/entities/community';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { CommunitiesDAF } from '@/services/database/communities-daf';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { makeSlug } from '../factories/make-slug';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error';
import { ParishAlreadyExistsError } from '../errors/parish-already-exists-error';

interface CreateCommunityUseCaseRequest {
  name: string;
  type: 'chapel' | 'parish_church';
  address: string;
  coverId: string;
}

interface CreateCommunityUseCaseResponse {
  community: Community;
}

export class CreateCommunityUseCase {
  constructor(
    private communitiesDaf: CommunitiesDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    name,
    type,
    address,
    coverId,
  }: CreateCommunityUseCaseRequest): Promise<CreateCommunityUseCaseResponse> {
    const communityWithSameName = await this.communitiesDaf.findByName(name);

    if (communityWithSameName) {
      throw new ResourceAlreadyExistsError();
    }

    if (type === 'parish_church') {
      const parishCommunity = await this.communitiesDaf.findParish();

      if (parishCommunity) {
        throw new ParishAlreadyExistsError();
      }
    }

    const attachment = await this.attachmentsDaf.findById(coverId);

    if (!attachment) {
      throw new AttachmentNotFoundError();
    }

    await this.attachmentsDaf.save(attachment.id, { status: 'attached' });

    const community = {
      id: ulid(),
      name,
      slug: makeSlug(name),
      type,
      address,
      coverId,
      createdAt: new Date().toISOString(),
    };

    await this.communitiesDaf.create(community);

    return { community };
  }
}
