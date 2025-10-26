import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteBlogPostDraftUseCase } from '@/use-cases/factories/blog/post-drafts/make-delete-blog-post-draft-use-case';

export const deletePostDraft = async (c: DomainContext) => {
  const { user, t, params } = getAppContext(c);

  const { id: postDraftId } = params;

  try {
    const deleteUseCase = makeDeleteBlogPostDraftUseCase(c);

    await deleteUseCase.execute({
      postDraftId,
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
