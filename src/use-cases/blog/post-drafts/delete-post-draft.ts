import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface DeleteBlogPostDraftUseCaseRequest {
  postDraftId: string;
  userId: string;
  userRole: string;
}

export class DeleteBlogPostDraftUseCase {
  constructor(
    private postDraftDaf: BlogPostDraftsDAF,
    private postDaf: BlogPostDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    postDraftId,
    userId,
    userRole,
  }: DeleteBlogPostDraftUseCaseRequest): Promise<void> {
    const postDraft = await this.postDraftDaf.findById(postDraftId);

    if (!postDraft) {
      throw new ResourceNotFoundError();
    }

    if (postDraft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    const post = await this.postDaf.findById(postDraft.postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    if (post.coverId !== postDraft.coverId) {
      await this.attachmentsDaf.save(postDraft.coverId, { status: 'deleted' });
    }

    await this.postDraftDaf.delete(postDraftId);
  }
}
