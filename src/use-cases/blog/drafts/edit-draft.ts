import type { BlogDraft } from '@/entities/blog-draft';
import type { User } from '@/entities/user';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeExcerpt } from '@/use-cases/factories/make-excerpt';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface EditBlogDraftUseCaseRequest {
  draftId: string;
  title: string;
  content: string;
  excerpt?: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  categorySlug: string;
  userId: string;
  userRole: User['role'];
}

interface EditBlogDraftUseCaseResponse {
  draft: BlogDraft;
}

export class EditBlogDraftUseCase {
  constructor(
    private draftDaf: BlogDraftsDAF,
    private categoriesDaf: BlogCategoriesDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    draftId,
    title,
    content,
    excerpt,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
    categorySlug,
    userId,
    userRole,
  }: EditBlogDraftUseCaseRequest): Promise<EditBlogDraftUseCaseResponse> {
    const draft = await this.draftDaf.findById(draftId);

    if (!draft) {
      throw new ResourceNotFoundError('DRAFT_NOT_FOUND');
    }

    if (draft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    const category = await this.categoriesDaf.findBySlug(categorySlug);

    if (!category) {
      throw new ResourceNotFoundError('CATEGORY_NOT_FOUND');
    }

    if (draft.title !== title || draft.categoryId !== category.id) {
      const draftWithSameTitle = await this.draftDaf.findByTitleAndCategory({
        title,
        categoryId: category.id,
      });

      if (draftWithSameTitle) {
        throw new NameAlreadyExistsError();
      }
    }

    if (draft.coverId !== coverId) {
      const attachment = await this.attachmentsDaf.findById(coverId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }
    }

    draft.title = title;
    draft.slug = makeSlug(title);
    draft.content = content;
    draft.excerpt = excerpt || makeExcerpt(content);
    draft.eventDate = eventDate;
    draft.scheduledPublishAt = scheduledPublishAt;
    draft.scheduledUnpublishAt = scheduledUnpublishAt;
    draft.coverId = coverId;
    draft.categoryId = category.id;
    draft.updatedAt = new Date().toISOString();

    await this.draftDaf.save(draft);

    return { draft };
  }
}
