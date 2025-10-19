import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryPastoralsDAF } from '../database/in-memory-pastorals-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { CreatePastoralUseCase } from '@/use-cases/pastorals/create-pastoral';
import { makeUser } from '../factories/makeUser';
import { makeAttachment } from '../factories/makeAttachment';
import type { User } from '@/entities/user';

let usersDaf: InMemoryUserDAF;
let pastoralsDaf: InMemoryPastoralsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: CreatePastoralUseCase;
let user: User;
let coverId: string;

describe('Create Pastoral Use Case', () => {
  beforeEach(async () => {
    pastoralsDaf = new InMemoryPastoralsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new CreatePastoralUseCase(pastoralsDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    coverId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );
  });

  it('should be able to create a pastoral', async () => {
    const { pastoral } = await sut.execute({
      name: 'Pastoral of Youth',
      description: 'A pastoral for the youth of the parish.',
      responsibleName: 'John Doe',
      contactPhone: '1234567890',
      coverId,
    });

    expect(pastoral.id).toBeDefined();
  });

  it('should not be able to create a pastoral with same name twice', async () => {
    await sut.execute({
      name: 'Pastoral of Youth',
      description: 'A pastoral for the youth of the parish.',
      responsibleName: 'John Doe',
      contactPhone: '1234567890',
      coverId,
    });

    await expect(() =>
      sut.execute({
        name: 'Pastoral of Youth',
        description: 'A pastoral for the youth of the parish.',
        responsibleName: 'John Doe',
        contactPhone: '1234567890',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
