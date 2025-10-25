import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeSlug } from '@/use-cases/factories/make-slug';
import { makeExcerpt } from '@/use-cases/factories/make-excerpt';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';

interface EditBlogPostDraftUseCaseRequest {
  postDraftId: string;
  title: string;
  excerpt?: string;
  content: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  userId: string;
  userRole: string;
}

interface EditBlogPostDraftUseCaseResponse {
  postDraft: BlogPostDraft;
}

export class EditBlogPostDraftUseCase {
  constructor(
    private postDraftDaf: BlogPostDraftsDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    postDraftId,
    title,
    excerpt,
    content,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
    userId,
    userRole,
  }: EditBlogPostDraftUseCaseRequest): Promise<EditBlogPostDraftUseCaseResponse> {
    const postDraft = await this.postDraftDaf.findById(postDraftId);

    if (!postDraft) {
      throw new ResourceNotFoundError();
    }

    if (postDraft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    if (postDraft.coverId !== coverId) {
      const attachment = await this.attachmentsDaf.findById(coverId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }

      await Promise.all([
        this.attachmentsDaf.save(postDraft.coverId, { status: 'deleted' }),
        this.attachmentsDaf.save(coverId, { status: 'attached' }),
      ]);
    }

    postDraft.title = title;
    postDraft.slug = makeSlug(title);
    postDraft.excerpt = excerpt ?? makeExcerpt(content);
    postDraft.content = content;
    postDraft.eventDate = eventDate
      ? new Date(eventDate).toISOString()
      : undefined;
    postDraft.scheduledPublishAt = scheduledPublishAt
      ? new Date(scheduledPublishAt).toISOString()
      : undefined;
    postDraft.scheduledUnpublishAt = scheduledUnpublishAt
      ? new Date(scheduledUnpublishAt).toISOString()
      : undefined;
    postDraft.coverId = coverId;
    postDraft.updatedAt = new Date().toISOString();

    await this.postDraftDaf.save(postDraft);

    return { postDraft };
  }
}
