import type { BlogDraft } from '@/entities/blog-draft';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeExcerpt } from '@/use-cases/factories/make-excerpt';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface CreateBlogDraftUseCaseRequest {
  title: string;
  content: string;
  excerpt?: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  categorySlug: string;
  authorId: string;
}

interface CreateBlogDraftUseCaseResponse {
  draft: BlogDraft;
}

export class CreateBlogDraftUseCase {
  constructor(
    private draftDaf: BlogDraftsDAF,
    private categoriesDaf: BlogCategoriesDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    title,
    content,
    excerpt,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
    categorySlug,
    authorId,
  }: CreateBlogDraftUseCaseRequest): Promise<CreateBlogDraftUseCaseResponse> {
    const category = await this.categoriesDaf.findBySlug(categorySlug);

    if (!category) {
      throw new ResourceNotFoundError();
    }

    const draftWithSameTitle = await this.draftDaf.findByTitleAndCategory({
      title,
      categoryId: category.id,
    });

    if (draftWithSameTitle) {
      throw new NameAlreadyExistsError();
    }

    const attachment = await this.attachmentsDaf.findById(coverId);

    if (!attachment) {
      throw new AttachmentNotFoundError();
    }

    const draft = {
      id: makeId(),
      title,
      slug: makeSlug(title),
      content,
      excerpt: excerpt || makeExcerpt(content),
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId: attachment.id,
      categoryId: category.id,
      authorId,
      createdAt: new Date().toISOString(),
    };

    await this.draftDaf.create(draft);

    return { draft };
  }
}
