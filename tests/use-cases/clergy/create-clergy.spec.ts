import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../../database/in-memory-users-daf';
import { InMemoryClergyDAF } from '../../database/in-memory-clergy-daf';
import { InMemoryAttachmentsDAF } from '../../database/in-memory-attachments-daf';
import { CreateClergyUseCase } from '@/use-cases/clergy/create-clergy';
import { makeUser } from '../../factories/make-user';
import { makeAttachment } from '../../factories/make-attachment';
import type { User } from '@/entities/user';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { makeClergy } from '../../factories/make-clergy';
import { ClergyPositionAlreadyExistsError } from '@/use-cases/errors/clergy-position-already-exists-error';

let usersDaf: InMemoryUserDAF;
let clergyDaf: InMemoryClergyDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: CreateClergyUseCase;
let user: User;
let photoId: string;

describe('Create Clergy Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    clergyDaf = new InMemoryClergyDAF();
    sut = new CreateClergyUseCase(clergyDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    photoId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: photoId, userId: user.id }),
    );
  });

  it('should be able to create a clergy', async () => {
    const { clergy } = await sut.execute({
      name: 'John Smith',
      position: 'diocesan_bishop',
      title: 'Dom',
      photoId,
    });

    expect(clergy.id).toBeDefined();
  });

  it('should not be able to create a unique position clergy twice', async () => {
    await clergyDaf.create(
      makeClergy({
        position: 'supreme_pontiff',
        title: 'Pope',
        photoId,
      }),
    );
    await clergyDaf.create(
      makeClergy({ position: 'diocesan_bishop', title: 'Dom', photoId }),
    );
    await clergyDaf.create(
      makeClergy({ position: 'parish_priest', title: 'Priest', photoId }),
    );

    await expect(() =>
      sut.execute({
        name: 'Another Name',
        position: 'supreme_pontiff',
        title: 'Pope',
        photoId,
      }),
    ).rejects.toBeInstanceOf(ClergyPositionAlreadyExistsError);

    await expect(() =>
      sut.execute({
        name: 'Another Name',
        position: 'diocesan_bishop',
        title: 'Dom',
        photoId,
      }),
    ).rejects.toBeInstanceOf(ClergyPositionAlreadyExistsError);

    await expect(() =>
      sut.execute({
        name: 'Another Name',
        position: 'parish_priest',
        title: 'Priest',
        photoId,
      }),
    ).rejects.toBeInstanceOf(ClergyPositionAlreadyExistsError);
  });

  it('should not be able to create a Permanent Deacon with same name twice', async () => {
    await sut.execute({
      name: 'John Smith',
      position: 'permanent_deacon',
      title: 'Deacon',
      photoId,
    });

    await expect(() =>
      sut.execute({
        name: 'John Smith',
        position: 'permanent_deacon',
        title: 'Deacon',
        photoId,
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });
});
