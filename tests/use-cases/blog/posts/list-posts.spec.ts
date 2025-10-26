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
import { ListBlogPostsUseCase } from '@/use-cases/blog/posts/list-posts';
import { InMemoryBlogCategoriesDAF } from '@tests/database/in-memory-blog-categories-daf';
import type { BlogCategory } from '@/entities/blog-category';
import { makeBlogCategory } from '@tests/factories/make-blog-category';

let postDaf: InMemoryBlogPostsDAF;
let categoriesDaf: InMemoryBlogCategoriesDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: ListBlogPostsUseCase;

let user: User;
let category: BlogCategory;
let post: BlogPost;
let coverId: string;

describe('List Posts Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDaf = new InMemoryBlogPostsDAF();
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new ListBlogPostsUseCase(postDaf, categoriesDaf);

    user = await usersDaf.create(await makeUser());

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    category = makeBlogCategory();
    await categoriesDaf.create(category);

    post = makeBlogPost({
      authorId: user.id,
      categoryId: makeId(),
      coverId,
    });
    await postDaf.create(post);
  });

  it('should be able to list posts', async () => {
    const { posts } = await sut.execute({
      categorySlug: category.slug,
      page: 1,
    });

    expect(posts).toHaveLength(1);
  });

  it('should be able to list posts by category', async () => {
    const anotherCategory = makeBlogCategory();
    await categoriesDaf.create(anotherCategory);

    const anotherPost = makeBlogPost({
      authorId: user.id,
      categoryId: anotherCategory.id,
      coverId,
    });
    await postDaf.create(anotherPost);

    const { posts } = await sut.execute({
      categorySlug: anotherCategory.slug,
      page: 1,
    });

    expect(posts).toHaveLength(1);
    expect(posts).toEqual([anotherPost]);
  });

  it('should not be able to list posts with wrong category is', async () => {
    await expect(
      sut.execute({
        categorySlug: 'missing-category',
        page: 1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
