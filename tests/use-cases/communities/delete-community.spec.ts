import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../../database/in-memory-users-daf';
import { InMemoryCommunitiesDAF } from '../../database/in-memory-communities-daf';
import { InMemoryAttachmentsDAF } from '../../database/in-memory-attachments-daf';
import { DeleteCommunityUseCase } from '@/use-cases/communities/delete-community';
import { makeUser } from '../../factories/make-user';
import { makeAttachment } from '../../factories/make-attachment';
import type { User } from '@/entities/user';
import type { Community } from '@/entities/community';
import { makeCommunity } from '../../factories/make-community';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

let usersDaf: InMemoryUserDAF;
let communitiesDaf: InMemoryCommunitiesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: DeleteCommunityUseCase;
let user: User;
let community: Community;
let coverId: string;

describe('Delete Community Use Case', () => {
  beforeEach(async () => {
    communitiesDaf = new InMemoryCommunitiesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new DeleteCommunityUseCase(communitiesDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    coverId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    community = makeCommunity({
      coverId,
    });

    await communitiesDaf.create(makeCommunity(community));
  });

  it('should be able to delete a community', async () => {
    await sut.execute({
      communityId: community.id,
    });

    const deletedCommunity = await communitiesDaf.findById(community.id);

    expect(deletedCommunity).toBeNull();

    const deletedAttachment = await attachmentsDaf.findById(coverId);

    expect(deletedAttachment).toBeDefined();
    expect(deletedAttachment?.status).toEqual('deleted');
  });

  it('should not be able to delete a community with wrong id', async () => {
    await expect(() =>
      sut.execute({
        communityId: 'non-existing-community-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
