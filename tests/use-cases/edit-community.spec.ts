import { describe, beforeEach, it, expect } from 'vitest';
import { hashPassword, ulid, uuidV4 } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryCommunitiesDAF } from '../database/in-memory-communities-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { ParishAlreadyExistsError } from '@/use-cases/errors/parish-already-exists-error';
import { EditCommunityUseCase } from '@/use-cases/communities/edit-community';

let usersDaf: InMemoryUserDAF;
let communitiesDaf: InMemoryCommunitiesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: EditCommunityUseCase;

describe('Edit Community Use Case', () => {
  beforeEach(() => {
    communitiesDaf = new InMemoryCommunitiesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new EditCommunityUseCase(communitiesDaf, attachmentsDaf);
  });

  it('should be able to edit a community', async () => {
    const user = await usersDaf.create({
      email: 'janedoe@example.com',
      passwordHash: await hashPassword('123@Mudar'),
      role: 'user',
    });

    const coverId = ulid();

    await attachmentsDaf.create({
      id: coverId,
      filename: `${uuidV4()}.jpg`,
      mimeType: 'image/jpeg',
      userId: user.id,
    });

    const community = {
      id: ulid(),
      name: 'Old Community Name',
      slug: 'old-community-name',
      type: 'parish_church' as const,
      address: '456 Old St, Anytown, USA',
      createdAt: new Date().toISOString(),
      coverId,
    };

    await communitiesDaf.create(community);

    const { community: newCommunity } = await sut.execute({
      id: community.id,
      name: 'Chapel of St. Mary',
      type: 'chapel',
      address: '789 New St, Othertown, USA',
      coverId,
    });

    expect(newCommunity).toMatchObject({
      name: 'Chapel of St. Mary',
      type: 'chapel',
      address: '789 New St, Othertown, USA',
      coverId,
    });
  });

  it('should not be able to save a community with same name twice', async () => {
    const user = await usersDaf.create({
      email: 'janedoe@example.com',
      passwordHash: await hashPassword('123@Mudar'),
      role: 'user',
    });

    const coverId = ulid();

    await attachmentsDaf.create({
      id: coverId,
      filename: `${uuidV4()}.jpg`,
      mimeType: 'image/jpeg',
      userId: user.id,
    });

    await communitiesDaf.create({
      id: ulid(),
      name: 'Chapel of St. Mary',
      slug: 'chapel-of-st-mary',
      type: 'chapel',
      address: '456 Old St, Anytown, USA',
      createdAt: new Date().toISOString(),
      coverId,
    });

    const community = {
      id: ulid(),
      name: 'Chapel of St. Anna',
      slug: 'chapel-of-st-mary',
      type: 'chapel' as const,
      address: '456 Old St, Anytown, USA',
      createdAt: new Date().toISOString(),
      coverId,
    };

    await communitiesDaf.create(community);

    await expect(() =>
      sut.execute({
        id: community.id,
        name: 'Chapel of St. Mary',
        type: 'chapel' as const,
        address: '456 Old St, Anytown, USA',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it('should not be able to edit a community as parish twice', async () => {
    const user = await usersDaf.create({
      email: 'janedoe@example.com',
      passwordHash: await hashPassword('123@Mudar'),
      role: 'user',
    });

    const coverId = ulid();

    await attachmentsDaf.create({
      id: coverId,
      filename: `${uuidV4()}.jpg`,
      mimeType: 'image/jpeg',
      userId: user.id,
    });

    await communitiesDaf.create({
      id: ulid(),
      name: 'Parish of St. Mary',
      slug: 'parish-of-st-mary',
      type: 'parish_church',
      address: '456 Old St, Anytown, USA',
      createdAt: new Date().toISOString(),
      coverId,
    });

    const community = {
      id: ulid(),
      name: 'Parish of St. Anna',
      slug: 'parish-of-st-anna',
      type: 'chapel' as const,
      address: '456 Old St, Anytown, USA',
      createdAt: new Date().toISOString(),
      coverId,
    };

    await communitiesDaf.create(community);

    await expect(() =>
      sut.execute({
        id: community.id,
        name: community.name,
        type: 'parish_church',
        address: '456 Old St, Anytown, USA',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ParishAlreadyExistsError);
  });
});
