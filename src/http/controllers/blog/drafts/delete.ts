import { getAppContext } from '@/http/utils/getAppContext';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteBlogDraftUseCase } from '@/use-cases/factories/blog/drafts/make-delete-blog-draft-use-case';

export const deleteDraft: ControllerFn = async (c) => {
  const { user, t, params } = getAppContext(c);

  const { id } = params;

  try {
    const deleteUseCase = makeDeleteBlogDraftUseCase(c);

    await deleteUseCase.execute({
      draftId: id,
      userId: user.id,
      userRole: user.role,
    });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-draft-not-found') }, 400);
    }

    if (err instanceof NotAllowedError) {
      return c.json({ message: t('error-not-allowed-to-edit-draft') }, 403);
    }

    throw err;
  }
};
