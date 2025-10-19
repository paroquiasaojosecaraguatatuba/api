import { describe, beforeEach, it, expect } from 'vitest';
import { ulid } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InMemoryPastoralsDAF } from '../database/in-memory-pastorals-daf';
import { InMemoryAttachmentsDAF } from '../database/in-memory-attachments-daf';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { EditPastoralUseCase } from '@/use-cases/pastorals/edit-pastoral';
import { makeAttachment } from '../factories/makeAttachment';
import { makeUser } from '../factories/makeUser';
import { makePastoral } from '../factories/makePastoral';
import type { User } from '@/entities/user';

let usersDaf: InMemoryUserDAF;
let pastoralsDaf: InMemoryPastoralsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let sut: EditPastoralUseCase;
let user: User;
let coverId: string;

describe('Edit Pastoral Use Case', () => {
  beforeEach(async () => {
    pastoralsDaf = new InMemoryPastoralsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    usersDaf = new InMemoryUserDAF();
    sut = new EditPastoralUseCase(pastoralsDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());
    coverId = ulid();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );
  });

  it('should be able to edit a pastoral', async () => {
    const pastoral = makePastoral({
      coverId,
    });

    await pastoralsDaf.create(pastoral);

    const { pastoral: newPastoral } = await sut.execute({
      id: pastoral.id,
      name: 'Pastoral of Prayer',
      contactPhone: '123456789',
      description: 'A community focused on prayer activities.',
      responsibleName: 'John Doe',
      coverId,
    });

    expect(newPastoral).toMatchObject({
      name: 'Pastoral of Prayer',
      contactPhone: '123456789',
      description: 'A community focused on prayer activities.',
      responsibleName: 'John Doe',
      coverId,
    });
  });

  it('should not be able to save a pastoral with same name twice', async () => {
    await pastoralsDaf.create(
      makePastoral({
        name: 'Pastoral of Prayer',
        coverId,
      }),
    );

    const pastoral = makePastoral({
      name: 'Pastoral of Music',
      coverId,
    });

    await pastoralsDaf.create(pastoral);

    await expect(() =>
      sut.execute({
        id: pastoral.id,
        name: 'Pastoral of Prayer',
        description: 'Another description',
        responsibleName: 'Jane Smith',
        contactPhone: '987654321',
        coverId,
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
