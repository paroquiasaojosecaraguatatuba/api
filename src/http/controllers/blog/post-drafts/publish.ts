import { getAppContext } from '@/http/utils/getAppContext';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makePublishBlogPostDraftUseCase } from '@/use-cases/factories/blog/post-drafts/make-publish-blog-post-draft-use-case';

export const publishPostDraft: ControllerFn = async (c) => {
  const { user, t, params } = getAppContext(c);

  const { id: postDraftId } = params;

  try {
    const createUseCase = makePublishBlogPostDraftUseCase(c);

    await createUseCase.execute({
      postDraftId,
      userId: user.id,
      userRole: user.role,
    });

    return c.json(200);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-draft-not-found') }, 400);
    }

    if (err instanceof NotAllowedError) {
      return c.json({ message: t('error-not-allowed-to-publish-draft') }, 403);
    }

    if (err instanceof NameAlreadyExistsError) {
      return c.json(
        { message: t('error-blog-post-title-already-in-use') },
        400,
      );
    }

    throw err;
  }
};
