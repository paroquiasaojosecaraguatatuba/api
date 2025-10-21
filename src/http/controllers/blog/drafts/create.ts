import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogDraftSchema } from '@/schemas/blog/use-blog-draft-schema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCreateBlogDraftUseCase } from '@/use-cases/factories/blog/drafts/make-create-blog-draft-use-case';

export const createDraft: ControllerFn = async (c) => {
  const { user, t, inputs } = getAppContext(c);

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

  try {
    const createUseCase = makeCreateBlogDraftUseCase(c);

    const { draft } = await createUseCase.execute({
      title,
      content,
      excerpt,
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId,
      categorySlug,
      authorId: user.id,
    });

    return c.json({ draft }, 201);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
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
