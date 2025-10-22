import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface PublishBlogDraftUseCaseRequest {
  draftId: string;
  userId: string;
  userRole: string;
}

export class PublishBlogDraftUseCase {
  constructor(
    private draftsDaf: BlogDraftsDAF,
    private postsDaf: BlogPostDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({ draftId, userId, userRole }: PublishBlogDraftUseCaseRequest) {
    const draft = await this.draftsDaf.findById(draftId);

    if (!draft) {
      throw new ResourceNotFoundError();
    }

    if (draft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    await this.postsDaf.create({
      ...draft,
      publishedAt: new Date().toISOString(),
    });

    await this.attachmentsDaf.save(draft.coverId, { status: 'deleted' });
    await this.draftsDaf.delete(draftId);
  }
}
