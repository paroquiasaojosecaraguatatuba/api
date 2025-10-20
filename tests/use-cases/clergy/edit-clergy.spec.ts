import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../../database/in-memory-users-daf';
import { InMemoryClergyDAF } from '../../database/in-memory-clergy-daf';
import { InMemoryAttachmentsDAF } from '../../database/in-memory-attachments-daf';
import { EditClergyUseCase } from '@/use-cases/clergy/edit-clergy';
import { makeUser } from '../../factories/make-user';
import { makeAttachment } from '../../factories/make-attachment';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { makeClergy } from '../../factories/make-clergy';
import { ClergyPositionAlreadyExistsError } from '@/use-cases/errors/clergy-position-already-exists-error';

let usersDaf: InMemoryUserDAF;
let clergyDaf: InMemoryClergyDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: EditClergyUseCase;
let photoId: string;

describe('Edit Clergy Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    clergyDaf = new InMemoryClergyDAF();
    sut = new EditClergyUseCase(clergyDaf, attachmentsDaf);

    const user = await usersDaf.create(await makeUser());
    photoId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: photoId, userId: user.id }),
    );
  });

  it('should be able to edit a clergy', async () => {
    const clergy = makeClergy({
      photoId,
    });

    await clergyDaf.create(clergy);

    const { clergy: newClergy } = await sut.execute({
      clergyId: clergy.id,
      name: 'John Smith',
      position: 'diocesan_bishop',
      title: 'Dom',
      photoId,
    });

    expect(newClergy).toMatchObject({
      name: 'John Smith',
      position: 'diocesan_bishop',
      title: 'Dom',
      photoId,
    });
  });

  it('should not be able to edit with a unique position that already in use', async () => {
    const clergy = makeClergy({
      position: 'supreme_pontiff',
      title: 'Pope',
      photoId,
    });

    await clergyDaf.create(clergy);

    const anotherClergy = makeClergy({
      position: 'diocesan_bishop',
      title: 'Dom',
      photoId,
    });

    await clergyDaf.create(anotherClergy);

    await expect(() =>
      sut.execute({
        clergyId: anotherClergy.id,
        name: 'Another Name',
        position: 'supreme_pontiff',
        title: 'Pope',
        photoId,
      }),
    ).rejects.toBeInstanceOf(ClergyPositionAlreadyExistsError);
  });

  it('should not be able to save a Permanent Deacon with a name that already in use', async () => {
    const clergy = makeClergy({
      position: 'permanent_deacon',
      name: 'Deacon John',
      photoId,
    });

    await clergyDaf.create(clergy);

    const anotherClergy = makeClergy({
      position: 'permanent_deacon',
      name: 'Deacon Mike',
      photoId,
    });

    await clergyDaf.create(anotherClergy);

    await expect(() =>
      sut.execute({
        clergyId: anotherClergy.id,
        name: 'Deacon John',
        position: 'permanent_deacon',
        title: 'Deacon',
        photoId,
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });
});
