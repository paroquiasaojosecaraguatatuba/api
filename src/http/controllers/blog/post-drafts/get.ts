import { getAppContext } from '@/http/utils/getAppContext';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeGetBlogPostDraftUseCase } from '@/use-cases/factories/blog/post-drafts/make-get-blog-post-draft-use-case';

export const getPostDraft: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id: postDraftId } = params;

  try {
    const useCase = makeGetBlogPostDraftUseCase(c);

    const { postDraft } = await useCase.execute({
      postDraftId,
    });

    return c.json({ postDraft }, 201);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-draft-not-found') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
