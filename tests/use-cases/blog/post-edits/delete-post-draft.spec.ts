import { describe, beforeEach, it, expect } from 'vitest';
import { DeleteBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/delete-post-draft';
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

let postDraftDaf: InMemoryBlogPostDraftsDAF;
let postDaf: InMemoryBlogPostsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: DeleteBlogPostDraftUseCase;

let user: User;
let postDraft: BlogPostDraft;
let coverId: string;

describe('Delete Post Edit Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDraftDaf = new InMemoryBlogPostDraftsDAF();
    postDaf = new InMemoryBlogPostsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new DeleteBlogPostDraftUseCase(postDraftDaf, postDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    const post = makeBlogPost();

    await postDaf.create(post);

    postDraft = makeBlogPostDraft({
      authorId: user.id,
      postId: post.id,
      coverId,
    });
    await postDraftDaf.create(postDraft);
  });

  it('should be able to delete a post edit', async () => {
    await sut.execute({
      postDraftId: postDraft.id,
      userId: user.id,
      userRole: 'user',
    });

    const foundPostDraft = await postDraftDaf.findById(postDraft.id);

    expect(foundPostDraft).toBeNull();
  });

  it('should be able to delete a post edit as admin', async () => {
    const anotherUser = await usersDaf.create(await makeUser());

    await sut.execute({
      postDraftId: postDraft.id,
      userId: anotherUser.id,
      userRole: 'admin',
    });

    const foundPostDraft = await postDraftDaf.findById(postDraft.id);

    expect(foundPostDraft).toBeNull();
  });

  it('should not be able to delete a post edit with wrong post id', async () => {
    await expect(() =>
      sut.execute({
        postDraftId: 'mistaken-post-edit-id',
        userId: user.id,
        userRole: 'user',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete a post edit if user is not the author nor admin', async () => {
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
