import { getAppContext } from '@/http/utils/getAppContext';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makePublishBlogDraftUseCase } from '@/use-cases/factories/blog/drafts/make-publish-blog-draft-use-case';

export const publishDraft: ControllerFn = async (c) => {
  const { user, t, params } = getAppContext(c);

  const { id } = params;

  try {
    const publishUseCase = makePublishBlogDraftUseCase(c);

    await publishUseCase.execute({
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
      return c.json({ message: t('error-not-allowed-to-publish-draft') }, 403);
    }

    if (err instanceof NameAlreadyExistsError) {
      return c.json(
        { message: t('error-blog-post-title-already-in-use') },
        403,
      );
    }

    throw err;
  }
};
