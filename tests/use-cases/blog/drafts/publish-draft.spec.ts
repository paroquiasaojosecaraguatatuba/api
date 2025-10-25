import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '@tests/database/in-memory-blog-categories-daf';
import { PublishBlogDraftUseCase } from '@/use-cases/blog/drafts/publish-draft';
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
import type { BlogDraft } from '@/entities/blog-draft';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { InMemoryBlogDraftsDAF } from '@tests/database/in-memory-blog-drafts-daf';
import { InMemoryBlogPostsDAF } from '@tests/database/in-memory-blog-posts-daf';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { makeBlogPost } from '@tests/factories/make-blog-post';
import { CreateBlogPostHistoryUseCase } from '@/use-cases/blog/post-history/create-post-history';
import { InMemoryBlogPostHistoryDAF } from '@tests/database/in-memory-blog-post-history-daf';

let draftsDaf: InMemoryBlogDraftsDAF;
let postsDaf: InMemoryBlogPostsDAF;
let categoriesDaf: InMemoryBlogCategoriesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let postHistoryDaf: InMemoryBlogPostHistoryDAF;
let sut: PublishBlogDraftUseCase;

let user: User;
let category: BlogCategory;
let draft: BlogDraft;
let coverId: string;

describe('Delete Draft Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    draftsDaf = new InMemoryBlogDraftsDAF();
    postsDaf = new InMemoryBlogPostsDAF();
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    postHistoryDaf = new InMemoryBlogPostHistoryDAF();

    const createHistoryUseCase = new CreateBlogPostHistoryUseCase(
      postHistoryDaf,
      postsDaf,
    );

    sut = new PublishBlogDraftUseCase(
      draftsDaf,
      postsDaf,
      attachmentsDaf,
      createHistoryUseCase,
    );

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
    await draftsDaf.create(draft);
  });

  it('should be able to publish a draft', async () => {
    await sut.execute({
      draftId: draft.id,
      userId: user.id,
      userRole: user.role,
    });

    const deletedDraft = await draftsDaf.findById(draft.id);
    const attachment = await attachmentsDaf.findById(coverId);
    const post = await postsDaf.findById(draft.id);

    expect(deletedDraft).toBeNull();
    expect(attachment?.status).toEqual('attached');
    expect(post).toEqual(
      expect.objectContaining({
        id: draft.id,
        title: draft.title,
        slug: draft.slug,
        content: draft.content,
        excerpt: draft.excerpt,
        coverId: draft.coverId,
        categoryId: draft.categoryId,
        authorId: draft.authorId,
        createdAt: draft.createdAt,
        publishedAt: expect.any(String),
      }),
    );
  });

  it('should be able to publish a draft as admin', async () => {
    await sut.execute({
      draftId: draft.id,
      userId: makeId(),
      userRole: 'admin',
    });

    const deletedDraft = await draftsDaf.findById(draft.id);
    const attachment = await attachmentsDaf.findById(coverId);
    const post = await postsDaf.findById(draft.id);

    expect(deletedDraft).toBeNull();
    expect(attachment?.status).toEqual('attached');
    expect(post).toEqual(
      expect.objectContaining({
        id: draft.id,
        title: draft.title,
        slug: draft.slug,
        content: draft.content,
        excerpt: draft.excerpt,
        coverId: draft.coverId,
        categoryId: draft.categoryId,
        authorId: draft.authorId,
        createdAt: draft.createdAt,
        publishedAt: expect.any(String),
      }),
    );
  });

  it('should not be able to publish a draft if not the author or admin', async () => {
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

  it('should not be able to publish a draft with a title that already exists in the same category', async () => {
    await postsDaf.create(
      makeBlogPost({
        title: draft.title,
        categoryId: draft.categoryId,
      }),
    );

    await expect(() =>
      sut.execute({
        draftId: draft.id,
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });
});
