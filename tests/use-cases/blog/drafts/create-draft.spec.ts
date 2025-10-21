import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '@tests/database/in-memory-blog-categories-daf';
import { CreateBlogDraftUseCase } from '@/use-cases/blog/drafts/create-draft';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { InMemoryBlogDraftsDAF } from '@tests/database/in-memory-blog-draft-daf';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { makeBlogDraft } from '@tests/factories/make-blog-draft';
import type { BlogCategory } from '@/entities/blog-category';
import { makeBlogCategory } from '@tests/factories/make-blog-category';
import moment from 'moment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';

let draftDaf: InMemoryBlogDraftsDAF;
let categoriesDaf: InMemoryBlogCategoriesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: CreateBlogDraftUseCase;

let user: User;
let category: BlogCategory;
let coverId: string;

describe('Create Draft Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    draftDaf = new InMemoryBlogDraftsDAF();
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new CreateBlogDraftUseCase(draftDaf, categoriesDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());

    category = makeBlogCategory();
    await categoriesDaf.create(category);

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );
  });

  it('should be able to create a draft', async () => {
    const { draft } = await sut.execute({
      title: 'Contribua com a construção do nosso Centro Pastoral',
      content:
        'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
      categorySlug: category.slug,
      coverId,
      authorId: user.id,
      eventDate: moment().add(14, 'days').toISOString(),
      scheduledPublishAt: moment().add(7, 'days').toISOString(),
      scheduledUnpublishAt: moment().add(15, 'days').toISOString(),
    });

    expect(draft.id).toBeDefined();
  });

  it('should not be able to create a draft with wrong category', async () => {
    await expect(() =>
      sut.execute({
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: 'wrong-slug',
        coverId,
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create a draft with same title in category', async () => {
    await draftDaf.create(
      makeBlogDraft({
        title: 'Contribua com a construção do nosso Centro Pastoral',
        categoryId: category.id,
      }),
    );

    await expect(() =>
      sut.execute({
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId,
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });

  it('should not be able to create a draft with wrong coverId', async () => {
    await expect(() =>
      sut.execute({
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId: 'non-existing-cover-id',
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(AttachmentNotFoundError);
  });
});
