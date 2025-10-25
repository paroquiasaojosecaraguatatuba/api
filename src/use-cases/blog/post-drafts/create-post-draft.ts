import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';
import { makeExcerpt } from '@/use-cases/factories/make-excerpt';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { AlreadyExistsError } from '@/use-cases/errors/already-exists-error';

interface CreateBlogPostDraftUseCaseRequest {
  postId: string;
  title: string;
  excerpt?: string;
  content: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  authorId: string;
}

interface CreateBlogPostDraftUseCaseResponse {
  postDraft: BlogPostDraft;
}

export class CreateBlogPostDraftUseCase {
  constructor(
    private postDraftDaf: BlogPostDraftsDAF,
    private postDaf: BlogPostDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    postId,
    title,
    excerpt,
    content,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    coverId,
    authorId,
  }: CreateBlogPostDraftUseCaseRequest): Promise<CreateBlogPostDraftUseCaseResponse> {
    const alreadyExistingEdit = await this.postDraftDaf.findByPostId(postId);

    if (alreadyExistingEdit) {
      throw new AlreadyExistsError();
    }

    const post = await this.postDaf.findById(postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    if (post.coverId !== coverId) {
      const attachment = await this.attachmentsDaf.findById(coverId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }

      await this.attachmentsDaf.save(coverId, { status: 'attached' });
    }

    const postDraft = {
      id: makeId(),
      postId,
      title,
      slug: makeSlug(title),
      excerpt: excerpt ?? makeExcerpt(content),
      content,
      eventDate,
      scheduledPublishAt,
      scheduledUnpublishAt,
      coverId,
      createdAt: new Date().toISOString(),
      authorId,
    };

    await this.postDraftDaf.create(postDraft);

    post.editId = postDraft.id;
    post.updatedAt = new Date().toISOString();
    await this.postDaf.save(post);

    return { postDraft };
  }
}
