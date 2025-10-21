import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '@tests/database/in-memory-blog-categories-daf';
import { DeleteBlogDraftUseCase } from '@/use-cases/blog/drafts/delete-draft';
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
import { InMemoryBlogDraftsDAF } from '@tests/database/in-memory-blog-draft-daf';

let draftDaf: InMemoryBlogDraftsDAF;
let categoriesDaf: InMemoryBlogCategoriesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: DeleteBlogDraftUseCase;

let user: User;
let category: BlogCategory;
let draft: BlogDraft;
let coverId: string;

describe('Delete Draft Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    draftDaf = new InMemoryBlogDraftsDAF();
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new DeleteBlogDraftUseCase(draftDaf, attachmentsDaf);

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

  it('should be able to delete a draft', async () => {
    await sut.execute({
      draftId: draft.id,
      userId: user.id,
      userRole: user.role,
    });

    const deletedDraft = await draftDaf.findById(draft.id);
    const attachment = await attachmentsDaf.findById(coverId);

    expect(deletedDraft).toBeNull();
    expect(attachment?.status).toEqual('deleted');
  });

  it('should be able to delete a draft as admin', async () => {
    await sut.execute({
      draftId: draft.id,
      userId: makeId(),
      userRole: 'admin',
    });

    const deletedDraft = await draftDaf.findById(draft.id);
    const attachment = await attachmentsDaf.findById(coverId);

    expect(deletedDraft).toBeNull();
    expect(attachment?.status).toEqual('deleted');
  });

  it('should not be able to delete a draft if not the author or admin', async () => {
    const anotherUser = await usersDaf.create(await makeUser({ role: 'user' }));

    await expect(() =>
      sut.execute({
        draftId: draft.id,
        userId: anotherUser.id,
        userRole: anotherUser.role,
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a non existing draft', async () => {
    await expect(() =>
      sut.execute({
        draftId: 'non-existing-draft-id',
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
