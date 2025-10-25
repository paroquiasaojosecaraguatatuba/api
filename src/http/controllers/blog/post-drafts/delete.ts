import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteBlogPostEditUseCase } from '@/use-cases/factories/blog/post-drafts/make-delete-blog-post-edit-use-case';

export const deletePostDraft = async (c: DomainContext) => {
  const { user, t, params } = getAppContext(c);

  const { id: postEditId } = params;

  try {
    const deleteUseCase = makeDeleteBlogPostEditUseCase(c);

    await deleteUseCase.execute({
      postEditId,
      userId: user.id,
      userRole: user.role,
    });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-draft-not-found') }, 400);
    }

    throw err;
  }
};
