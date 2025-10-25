import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogPostHistorySchema } from '@/schemas/blog/use-blog-post-history-schema';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCreateBlogPostHistoryUseCase } from '@/use-cases/factories/blog/post-history/make-create-blog-post-history-use-case';

export const createPostHistory: ControllerFn = async (c) => {
  const { user, t, params, inputs } = getAppContext(c);

  const { action, changesSummary } = useBlogPostHistorySchema(t).parse(inputs);

  const { id: postId } = params;

  try {
    const createPostHistoryUseCase = makeCreateBlogPostHistoryUseCase(c);

    const { postHistory } = await createPostHistoryUseCase.execute({
      postId,
      action,
      changesSummary,
      userId: user.id,
    });

    return c.json({ postHistory }, 201);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-blog-post-not-found') }, 400);
    }

    throw err;
  }
};
