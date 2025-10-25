import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogPostEditSchema } from '@/schemas/blog/use-blog-post-edit-schema';
import { AlreadyExistsError } from '@/use-cases/errors/already-exists-error';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeCreateBlogPostDraftUseCase } from '@/use-cases/factories/blog/post-drafts/make-create-blog-post-draft-use-case';

export const createDraft: ControllerFn = async (c) => {
  const { user, t, inputs, params } = getAppContext(c);

  const {
    title,
    content,
    excerpt,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
  } = useBlogPostEditSchema(t).parse(inputs);

  const { id: postId } = params;

  try {
    const createUseCase = makeCreateBlogPostDraftUseCase(c);

    const { postEdit } = await createUseCase.execute({
      title,
      content,
      excerpt,
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId,
      authorId: user.id,
      postId,
    });

    return c.json({ postEdit }, 201);
  } catch (err) {
    if (err instanceof AlreadyExistsError) {
      return c.json({ message: t('error-blog-post-edit-already-exists') }, 400);
    }

    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-blog-post-not-found') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
