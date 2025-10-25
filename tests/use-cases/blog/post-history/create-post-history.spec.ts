import { describe, beforeEach, it, expect } from 'vitest';
import { CreateBlogPostHistoryUseCase } from '@/use-cases/blog/post-history/create-post-history';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InMemoryBlogPostHistoryDAF } from '@tests/database/in-memory-blog-post-history-daf';
import { InMemoryBlogPostsDAF } from '@tests/database/in-memory-blog-posts-daf';
import { makeBlogPost } from '@tests/factories/make-blog-post';
import type { BlogPost } from '@/entities/blog-post';

let postHistoryDaf: InMemoryBlogPostHistoryDAF;
let postDaf: InMemoryBlogPostsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: CreateBlogPostHistoryUseCase;

let user: User;
let post: BlogPost;
let coverId: string;

describe('Create Post History Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postHistoryDaf = new InMemoryBlogPostHistoryDAF();
    postDaf = new InMemoryBlogPostsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new CreateBlogPostHistoryUseCase(postHistoryDaf, postDaf);

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

  it('should be able to create a post history', async () => {
    const { postHistory } = await sut.execute({
      postId: post.id,
      action: 'published',
      userId: user.id,
      changesSummary: 'Initial publish of the blog post.',
    });

    expect(postHistory.id).toBeDefined();
  });

  it('should not be able to create a post history with wrong post id', async () => {
    await expect(() =>
      sut.execute({
        postId: 'non-existing-post-id',
        action: 'published',
        userId: makeId(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
