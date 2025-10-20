import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../../database/in-memory-users-daf';
import { InMemoryClergyDAF } from '../../database/in-memory-clergy-daf';
import { InMemoryAttachmentsDAF } from '../../database/in-memory-attachments-daf';
import { DeleteClergyUseCase } from '@/use-cases/clergy/delete-clergy';
import { makeUser } from '../../factories/make-user';
import { makeAttachment } from '../../factories/make-attachment';
import type { User } from '@/entities/user';
import type { Clergy } from '@/entities/clergy';
import { makeClergy } from '../../factories/make-clergy';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

let usersDaf: InMemoryUserDAF;
let clergyDaf: InMemoryClergyDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: DeleteClergyUseCase;
let user: User;
let clergy: Clergy;
let photoId: string;

describe('Delete Clergy Use Case', () => {
  beforeEach(async () => {
    clergyDaf = new InMemoryClergyDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new DeleteClergyUseCase(clergyDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    photoId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: photoId, userId: user.id }),
    );

    clergy = makeClergy({
      photoId,
    });

    await clergyDaf.create(makeClergy(clergy));
  });

  it('should be able to delete a clergy', async () => {
    await sut.execute({
      clergyId: clergy.id,
    });

    const deletedClergy = await clergyDaf.findById(clergy.id);

    expect(deletedClergy).toBeNull();

    const deletedAttachment = await attachmentsDaf.findById(photoId);

    expect(deletedAttachment).toBeDefined();
    expect(deletedAttachment?.status).toEqual('deleted');
  });

  it('should not be able to delete a clergy with wrong id', async () => {
    await expect(() =>
      sut.execute({
        clergyId: 'non-existing-clergy-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
