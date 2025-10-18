import { describe, beforeEach, it, expect } from 'vitest';
import { hashPassword, ulid, uuidV4 } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryCommunitiesDAF } from '../database/in-memory-communities-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { CreateCommunityUseCase } from '@/use-cases/communities/create-community';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { ParishAlreadyExistsError } from '@/use-cases/errors/parish-already-exists-error';

let usersDaf: InMemoryUserDAF;
let communitiesDaf: InMemoryCommunitiesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: CreateCommunityUseCase;

describe('Create Community Use Case', () => {
  beforeEach(() => {
    communitiesDaf = new InMemoryCommunitiesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new CreateCommunityUseCase(communitiesDaf, attachmentsDaf);
  });

  it('should be able to create a community', async () => {
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

    const { community } = await sut.execute({
      name: 'Parish Church of St. John',
      type: 'parish_church',
      address: '123 Main St, Anytown, USA',
      coverId,
    });

    expect(community.id).toBeDefined();
  });

  it('should not be able to create a community with same name twice', async () => {
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

    await sut.execute({
      name: 'Parish Church of St. John',
      type: 'parish_church',
      address: '123 Main St, Anytown, USA',
      coverId,
    });

    await expect(() =>
      sut.execute({
        name: 'Parish Church of St. John',
        type: 'parish_church',
        address: '123 Main St, Anytown, USA',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });

  it('should not be able to create a parish community twice', async () => {
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

    await sut.execute({
      name: 'Parish Church of St. John',
      type: 'parish_church',
      address: '123 Main St, Anytown, USA',
      coverId,
    });

    await expect(() =>
      sut.execute({
        name: 'Parish Church of St. Mary',
        type: 'parish_church',
        address: '123 Main St, Anytown, USA',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ParishAlreadyExistsError);
  });
});
