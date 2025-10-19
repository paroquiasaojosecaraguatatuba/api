import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryCommunitiesDAF } from '../database/in-memory-communities-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { CreateCommunityUseCase } from '@/use-cases/communities/create-community';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { ParishAlreadyExistsError } from '@/use-cases/errors/parish-already-exists-error';
import { makeUser } from '../factories/makeUser';
import { makeAttachment } from '../factories/makeAttachment';
import type { User } from '@/entities/user';

let usersDaf: InMemoryUserDAF;
let communitiesDaf: InMemoryCommunitiesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: CreateCommunityUseCase;
let user: User;
let coverId: string;

describe('Create Community Use Case', () => {
  beforeEach(async () => {
    communitiesDaf = new InMemoryCommunitiesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new CreateCommunityUseCase(communitiesDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    coverId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );
  });

  it('should be able to create a community', async () => {
    const { community } = await sut.execute({
      name: 'Parish Church of St. John',
      type: 'parish_church',
      address: '123 Main St, Anytown, USA',
      coverId,
    });

    expect(community.id).toBeDefined();
  });

  it('should not be able to create a community with same name twice', async () => {
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
