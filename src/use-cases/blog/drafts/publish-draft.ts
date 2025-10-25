import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import type { CreateBlogPostHistoryUseCase } from '../post-history/create-post-history';

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
    private createHistoryUseCase: CreateBlogPostHistoryUseCase,
  ) {}

  async execute({ draftId, userId, userRole }: PublishBlogDraftUseCaseRequest) {
    const draft = await this.draftsDaf.findById(draftId);

    if (!draft) {
      throw new ResourceNotFoundError();
    }

    if (draft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    const postWithSameTitle = await this.postsDaf.findByTitleAndCategory({
      title: draft.title,
      categoryId: draft.categoryId,
    });

    if (postWithSameTitle) {
      throw new NameAlreadyExistsError();
    }

    await this.postsDaf.create({
      ...draft,
      publishedAt: new Date().toISOString(),
    });

    await Promise.all([
      this.attachmentsDaf.save(draft.coverId, { status: 'attached' }),
      this.draftsDaf.delete(draft.id),
      this.createHistoryUseCase.execute({
        postId: draft.id,
        action: 'published',
        userId,
      }),
    ]);
  }
}
