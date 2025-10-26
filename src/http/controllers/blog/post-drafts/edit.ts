import { getAppContext } from '@/http/utils/getAppContext';
import { useBlogPostEditSchema } from '@/schemas/blog/use-blog-post-edit-schema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeEditBlogPostDraftUseCase } from '@/use-cases/factories/blog/post-drafts/make-edit-blog-post-draft-use-case';

export const editPostDraft: ControllerFn = async (c) => {
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

  const { id: postDraftId } = params;

  try {
    const createUseCase = makeEditBlogPostDraftUseCase(c);

    const { postDraft } = await createUseCase.execute({
      postDraftId,
      title,
      content,
      excerpt,
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId,
      userId: user.id,
      userRole: user.role,
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
