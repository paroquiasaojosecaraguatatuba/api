import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '@tests/database/in-memory-blog-categories-daf';
import { EditBlogDraftUseCase } from '@/use-cases/blog/drafts/edit-draft';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { InMemoryBlogDraftsDAF } from '@tests/database/in-memory-blog-drafts-daf';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { makeBlogDraft } from '@tests/factories/make-blog-draft';
import type { BlogCategory } from '@/entities/blog-category';
import { makeBlogCategory } from '@tests/factories/make-blog-category';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import type { BlogDraft } from '@/entities/blog-draft';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';

let draftDaf: InMemoryBlogDraftsDAF;
let categoriesDaf: InMemoryBlogCategoriesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: EditBlogDraftUseCase;

let user: User;
let category: BlogCategory;
let draft: BlogDraft;
let coverId: string;

describe('Edit Draft Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    draftDaf = new InMemoryBlogDraftsDAF();
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new EditBlogDraftUseCase(draftDaf, categoriesDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());

    category = makeBlogCategory();
    await categoriesDaf.create(category);

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    draft = makeBlogDraft({
      authorId: user.id,
      categoryId: category.id,
      coverId,
    });
    await draftDaf.create(draft);
  });

  it('should be able to edit a draft', async () => {
    const { draft: newDraft } = await sut.execute({
      draftId: draft.id,
      title: 'Contribua com a construção do nosso Centro Pastoral',
      content:
        'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
      categorySlug: category.slug,
      coverId,
      userId: user.id,
      userRole: user.role,
    });

    expect(newDraft.title).toEqual(
      'Contribua com a construção do nosso Centro Pastoral',
    );
  });

  it('should be able to edit a draft as admin', async () => {
    const { draft: newDraft } = await sut.execute({
      draftId: draft.id,
      title: 'Contribua com a construção do nosso Centro Pastoral',
      content:
        'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
      categorySlug: category.slug,
      coverId,
      userId: makeId(),
      userRole: 'admin',
    });

    expect(newDraft.title).toEqual(
      'Contribua com a construção do nosso Centro Pastoral',
    );
  });

  it('should not be able to edit a draft if not the author or admin', async () => {
    await expect(() =>
      sut.execute({
        draftId: draft.id,
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId,
        userRole: 'user',
        userId: makeId(),
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a non existing draft', async () => {
    await expect(() =>
      sut.execute({
        draftId: 'non-existing-draft-id',
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId,
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a draft with wrong category', async () => {
    await expect(() =>
      sut.execute({
        draftId: draft.id,
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: 'wrong-slug',
        coverId,
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a draft with same title in category', async () => {
    await draftDaf.create(
      makeBlogDraft({
        title: 'Contribua com a construção do nosso Centro Pastoral',
        categoryId: category.id,
      }),
    );

    await expect(() =>
      sut.execute({
        draftId: draft.id,
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId,
        userRole: user.role,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });

  it('should not be able to edit a draft with wrong coverId', async () => {
    await expect(() =>
      sut.execute({
        draftId: draft.id,
        title: 'Contribua com a construção do nosso Centro Pastoral',
        content:
          'Hoje, as crianças da nossa catequese se reúnem na área de trás da paróquia. Apesar do nosso esforço, este espaço, destinado a eventos, oferece pouca proteção contra chuvas e ventos, o que muitas vezes atrapalha as aulas e o aprendizado.',
        categorySlug: category.slug,
        coverId: 'non-existing-cover-id',
        userRole: user.role,
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(AttachmentNotFoundError);
  });
});
