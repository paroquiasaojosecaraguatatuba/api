import { describe, beforeEach, it, expect } from 'vitest';
import { CreateBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/create-post-draft';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InMemoryBlogPostsDAF } from '@tests/database/in-memory-blog-posts-daf';
import { InMemoryBlogPostDraftsDAF } from '@tests/database/in-memory-blog-post-drafts-daf';
import { makeBlogPost } from '@tests/factories/make-blog-post';
import type { BlogPost } from '@/entities/blog-post';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { makeExcerpt } from '@/use-cases/factories/make-excerpt';
import { AlreadyExistsError } from '@/use-cases/errors/already-exists-error';

let postDraftDaf: InMemoryBlogPostDraftsDAF;
let postDaf: InMemoryBlogPostsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: CreateBlogPostDraftUseCase;

let user: User;
let post: BlogPost;
let coverId: string;

describe('Create Post Edit Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDraftDaf = new InMemoryBlogPostDraftsDAF();
    postDaf = new InMemoryBlogPostsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new CreateBlogPostDraftUseCase(postDraftDaf, postDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    post = makeBlogPost({
      authorId: user.id,
      categoryId: makeId(),
      coverId,
    });
    await postDaf.create(post);
  });

  it('should be able to create a post edit', async () => {
    const { postDraft } = await sut.execute({
      postId: post.id,
      content: post.content,
      excerpt: post.excerpt,
      title: post.title,
      coverId: post.coverId,
      authorId: user.id,
    });

    expect(postDraft.id).toBeDefined();
    expect(post.editId).toEqual(postDraft.id);
  });

  it('should be able to create a post edit without excerpt', async () => {
    const { postDraft } = await sut.execute({
      postId: post.id,
      content: post.content,
      title: post.title,
      coverId: post.coverId,
      authorId: user.id,
    });

    expect(postDraft.id).toBeDefined();
    expect(postDraft.excerpt).toEqual(makeExcerpt(post.content));
  });

  it('should not be able to create a post edit to same post twice', async () => {
    await sut.execute({
      postId: post.id,
      content: post.content,
      excerpt: post.excerpt,
      title: post.title,
      coverId: post.coverId,
      authorId: user.id,
    });

    await expect(() =>
      sut.execute({
        postId: post.id,
        content: post.content,
        excerpt: post.excerpt,
        title: post.title,
        coverId: post.coverId,
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(AlreadyExistsError);
  });

  it('should not be able to create a post edit with wrong post id', async () => {
    await expect(() =>
      sut.execute({
        postId: 'mistaken-post-id',
        content: post.content,
        excerpt: post.excerpt,
        title: post.title,
        coverId: post.coverId,
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create a post edit with wrong cover id', async () => {
    await expect(() =>
      sut.execute({
        postId: post.id,
        content: post.content,
        excerpt: post.excerpt,
        title: post.title,
        coverId: 'mistaken-cover-id',
        authorId: user.id,
      }),
    ).rejects.toBeInstanceOf(AttachmentNotFoundError);
  });
});
