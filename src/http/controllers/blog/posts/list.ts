import { getAppContext } from '@/http/utils/getAppContext';
import { usePaginationSchema } from '@/schemas/use-pagination-schema';
import { makeListBlogPostsUseCase } from '@/use-cases/factories/blog/posts/make-list-blog-posts-use-case';

export const listPosts: ControllerFn = async (c) => {
  const { t, queries } = getAppContext(c);

  const { page } = usePaginationSchema(t).parse(queries);

  const listUseCase = makeListBlogPostsUseCase(c);

  const { posts } = await listUseCase.execute({
    page,
  });

  return c.json({ posts });
};
