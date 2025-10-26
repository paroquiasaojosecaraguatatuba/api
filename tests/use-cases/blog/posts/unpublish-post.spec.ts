import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InMemoryBlogPostsDAF } from '@tests/database/in-memory-blog-posts-daf';
import { makeBlogPost } from '@tests/factories/make-blog-post';
import type { BlogPost } from '@/entities/blog-post';
import { UnpublishBlogPostUseCase } from '@/use-cases/blog/posts/unpublish-post';
import { makeBlogCategory } from '@tests/factories/make-blog-category';

let postDaf: InMemoryBlogPostsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: UnpublishBlogPostUseCase;

let user: User;
let post: BlogPost;
let coverId: string;

describe('Unpublish Post Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDaf = new InMemoryBlogPostsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new UnpublishBlogPostUseCase(postDaf);

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

  it('should be able to unpublish a post', async () => {
    await sut.execute({
      postId: post.id,
      userId: user.id,
      userRole: 'user',
    });

    const postUnpublished = await postDaf.findById(post.id);

    expect(postUnpublished).toBeDefined();
    expect(postUnpublished?.unpublishedAt).toBeDefined();
  });

  it('should not be able to unpublish a post with wrong category is', async () => {
    await expect(
      sut.execute({
        postId: 'non-existing-post-id',
        userId: user.id,
        userRole: 'user',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
