import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogPostsPaginationSchema } from '@/schemas/blog/use-blog-posts-pagination-schema';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeListBlogPostsUseCase } from '@/use-cases/factories/blog/posts/make-list-blog-posts-use-case';

export const listPosts: ControllerFn = async (c) => {
  const { t, queries } = getAppContext(c);

  const { page, categorySlug } = useBlogPostsPaginationSchema(t).parse(queries);

  try {
    const listUseCase = makeListBlogPostsUseCase(c);

    const { posts } = await listUseCase.execute({
      page,
      categorySlug,
    });

    return c.json({ posts });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-category-not-found') }, 404);
    }

    throw err;
  }
};
