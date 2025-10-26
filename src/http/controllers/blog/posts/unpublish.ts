import { getAppContext } from '@/http/utils/getAppContext';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeUnpublishBlogPostsUseCase } from '@/use-cases/factories/blog/posts/make-unpublish-blog-posts-use-case';

export const unpublishPost: ControllerFn = async (c) => {
  const { user, t, params } = getAppContext(c);

  const { id: postId } = params;

  try {
    const listUseCase = makeUnpublishBlogPostsUseCase(c);

    await listUseCase.execute({
      postId,
      userId: user.id,
      userRole: user.role,
    });

    return c.json(200);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-blog-post-not-found') }, 404);
    }

    if (err instanceof NotAllowedError) {
      return c.json({ message: t('error-not-allowed-to-unpublish-post') }, 403);
    }

    throw err;
  }
};
