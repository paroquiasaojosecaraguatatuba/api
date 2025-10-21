import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogDraftSchema } from '@/schemas/blog/use-blog-draft-schema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeEditBlogDraftUseCase } from '@/use-cases/factories/blog/drafts/make-edit-blog-draft-use-case';

export const editDraft: ControllerFn = async (c) => {
  const { user, t, inputs, params } = getAppContext(c);

  const validationSchema = useBlogDraftSchema(t);

  const {
    title,
    content,
    excerpt,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
    categorySlug,
  } = validationSchema.parse(inputs);

  const { id } = params;

  try {
    const createUseCase = makeEditBlogDraftUseCase(c);

    const { draft } = await createUseCase.execute({
      draftId: id,
      title,
      content,
      excerpt,
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId,
      categorySlug,
      userId: user.id,
      userRole: user.role,
    });

    return c.json({ draft });
  } catch (err) {
    if (
      err instanceof ResourceNotFoundError &&
      err.message === 'DRAFT_NOT_FOUND'
    ) {
      return c.json({ message: t('error-draft-not-found') }, 400);
    }

    if (err instanceof NotAllowedError) {
      return c.json({ message: t('error-not-allowed-to-edit-draft') }, 403);
    }

    if (
      err instanceof ResourceNotFoundError &&
      err.message === 'CATEGORY_NOT_FOUND'
    ) {
      return c.json({ message: t('error-category-not-found') }, 400);
    }

    if (err instanceof NameAlreadyExistsError) {
      return c.json(
        { message: t('error-blog-draft-title-already-in-use') },
        400,
      );
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
