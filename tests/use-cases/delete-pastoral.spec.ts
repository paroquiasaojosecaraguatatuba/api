import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryPastoralsDAF } from '../database/in-memory-pastorals-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { DeletePastoralUseCase } from '@/use-cases/pastorals/delete-pastoral';
import { makeUser } from '../factories/makeUser';
import { makeAttachment } from '../factories/makeAttachment';
import type { User } from '@/entities/user';
import type { Pastoral } from '@/entities/pastoral';
import { makePastoral } from '../factories/makePastoral';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

let usersDaf: InMemoryUserDAF;
let pastoralsDaf: InMemoryPastoralsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: DeletePastoralUseCase;
let user: User;
let pastoral: Pastoral;
let coverId: string;

describe('Delete Pastoral Use Case', () => {
  beforeEach(async () => {
    pastoralsDaf = new InMemoryPastoralsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new DeletePastoralUseCase(pastoralsDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    coverId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    pastoral = makePastoral({
      coverId,
    });

    await pastoralsDaf.create(makePastoral(pastoral));
  });

  it('should be able to delete a pastoral', async () => {
    await sut.execute({
      pastoralId: pastoral.id,
    });

    const deletedPastoral = await pastoralsDaf.findById(pastoral.id);

    expect(deletedPastoral).toBeNull();

    const deletedAttachment = await attachmentsDaf.findById(coverId);

    expect(deletedAttachment).toBeDefined();
    expect(deletedAttachment?.status).toEqual('deleted');
  });

  it('should not be able to delete a pastoral with wrong id', async () => {
    await expect(() =>
      sut.execute({
        pastoralId: 'non-existing-pastoral-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
