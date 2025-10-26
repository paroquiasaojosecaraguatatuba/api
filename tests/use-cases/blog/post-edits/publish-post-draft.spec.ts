import { describe, beforeEach, it, expect } from 'vitest';
import { PublishBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/publish-post-draft';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InMemoryBlogPostDraftsDAF } from '@tests/database/in-memory-blog-post-drafts-daf';
import type { BlogPostDraft } from '@/entities/blog-post-draft';
import { InMemoryBlogPostsDAF } from '@tests/database/in-memory-blog-posts-daf';
import { makeBlogPost } from '@tests/factories/make-blog-post';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { makeBlogPostDraft } from '@tests/factories/make-blog-post-draft';
import { InMemoryBlogPostHistoryDAF } from '@tests/database/in-memory-blog-post-history-daf';
import { CreateBlogPostHistoryUseCase } from '@/use-cases/blog/post-history/create-post-history';

let postDraftDaf: InMemoryBlogPostDraftsDAF;
let postsDaf: InMemoryBlogPostsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let postHistoryDaf: InMemoryBlogPostHistoryDAF;
let sut: PublishBlogPostDraftUseCase;

let user: User;
let postDraft: BlogPostDraft;
let coverId: string;

describe('Publish Post Draft Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDraftDaf = new InMemoryBlogPostDraftsDAF();
    postsDaf = new InMemoryBlogPostsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    postHistoryDaf = new InMemoryBlogPostHistoryDAF();

    const createHistoryUseCase = new CreateBlogPostHistoryUseCase(
      postHistoryDaf,
      postsDaf,
    );

    sut = new PublishBlogPostDraftUseCase(
      postDraftDaf,
      postsDaf,
      attachmentsDaf,
      createHistoryUseCase,
    );

    user = await usersDaf.create(await makeUser());

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    const post = makeBlogPost();

    await postsDaf.create(post);

    postDraft = makeBlogPostDraft({
      authorId: user.id,
      postId: post.id,
      coverId,
    });
    await postDraftDaf.create(postDraft);
  });

  it('should be able to publish a post draft', async () => {
    const date = new Date();
    const dateTime = date.getTime();

    await sut.execute({
      postDraftId: postDraft.id,
      userId: user.id,
      userRole: 'user',
    });

    const foundPostDraft = await postDraftDaf.findById(postDraft.id);

    const post = await postsDaf.findById(postDraft.postId);
    const publishedAtTime = new Date(post?.publishedAt || 0).getTime();

    expect(foundPostDraft).toBeNull();
    expect(post?.publishedAt).toBeDefined();
    expect(publishedAtTime).toBeGreaterThanOrEqual(dateTime - 1000); // Allowing 1 second margin
  });

  it('should be able to publish a post draft as admin', async () => {
    const date = new Date();
    const dateTime = date.getTime();

    const anotherUser = await usersDaf.create(await makeUser());

    await sut.execute({
      postDraftId: postDraft.id,
      userId: anotherUser.id,
      userRole: 'admin',
    });

    const foundPostDraft = await postDraftDaf.findById(postDraft.id);

    const post = await postsDaf.findById(postDraft.postId);
    const publishedAtTime = new Date(post?.publishedAt || 0).getTime();

    expect(foundPostDraft).toBeNull();
    expect(post?.publishedAt).toBeDefined();
    expect(publishedAtTime).toBeGreaterThanOrEqual(dateTime - 1000); // Allowing 1 second margin
  });

  it('should not be able to publish a post draft with wrong id', async () => {
    await expect(() =>
      sut.execute({
        postDraftId: 'mistaken-post-edit-id',
        userId: user.id,
        userRole: 'user',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to publish a post draft if user is not the author nor admin', async () => {
    const anotherUser = await usersDaf.create(await makeUser());

    await expect(() =>
      sut.execute({
        postDraftId: postDraft.id,
        userId: anotherUser.id,
        userRole: 'user',
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });
});
