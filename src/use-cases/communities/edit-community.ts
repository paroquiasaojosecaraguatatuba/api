import type { Community } from '@/entities/community';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { CommunitiesDAF } from '@/services/database/communities-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { makeSlug } from '../factories/make-slug';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error';
import { ParishAlreadyExistsError } from '../errors/parish-already-exists-error';

interface EditCommunityUseCaseRequest {
  id: string;
  name: string;
  type: 'chapel' | 'parish_church';
  address: string;
  coverId: string;
}

interface EditCommunityUseCaseResponse {
  community: Community;
}

export class EditCommunityUseCase {
  constructor(
    private communitiesDaf: CommunitiesDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    id,
    name,
    type,
    address,
    coverId,
  }: EditCommunityUseCaseRequest): Promise<EditCommunityUseCaseResponse> {
    const community = await this.communitiesDaf.findById(id);

    if (!community) {
      throw new ResourceNotFoundError();
    }

    if (community.type !== type && type === 'parish_church') {
      const parishCommunity = await this.communitiesDaf.findParish();

      if (parishCommunity) {
        throw new ParishAlreadyExistsError();
      }
    }

    if (community.name !== name) {
      const communityWithSameName = await this.communitiesDaf.findByName(name);

      if (communityWithSameName) {
        throw new ResourceAlreadyExistsError();
      }
    }

    if (community.coverId !== coverId) {
      const attachment = await this.attachmentsDaf.findById(coverId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }

      await Promise.all([
        this.attachmentsDaf.save(community.coverId, { status: 'deleted' }),
        this.attachmentsDaf.save(attachment.id, { status: 'attached' }),
      ]);
    }

    community.name = name;
    community.slug = makeSlug(name);
    community.type = type;
    community.address = address;
    community.coverId = coverId;
    community.updatedAt = new Date().toISOString();

    await this.communitiesDaf.save(community);

    return { community };
  }
}
