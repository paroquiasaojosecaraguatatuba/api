import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import type { CreateBlogPostHistoryUseCase } from '../post-history/create-post-history';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';

interface PublishBlogPostDraftUseCaseRequest {
  postDraftId: string;
  userId: string;
  userRole: string;
}

export class PublishBlogPostDraftUseCase {
  constructor(
    private postDraftsDaf: BlogPostDraftsDAF,
    private postsDaf: BlogPostDAF,
    private attachmentsDaf: AttachmentsDAF,
    private createHistoryUseCase: CreateBlogPostHistoryUseCase,
  ) {}

  async execute({
    postDraftId,
    userId,
    userRole,
  }: PublishBlogPostDraftUseCaseRequest) {
    const draft = await this.postDraftsDaf.findById(postDraftId);

    if (!draft) {
      throw new ResourceNotFoundError();
    }

    if (draft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    const post = await this.postsDaf.findById(draft.postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    if (draft.title !== post.title) {
      const postWithSameTitle = await this.postsDaf.findByTitleAndCategory({
        title: draft.title,
        categoryId: post.categoryId,
      });

      if (postWithSameTitle) {
        throw new NameAlreadyExistsError();
      }
    }

    await this.postsDaf.save({
      ...draft,
      categoryId: post.categoryId,
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    });

    if (draft.coverId !== post.coverId) {
      await this.attachmentsDaf.save(post.coverId, { status: 'deleted' });
    }

    await Promise.all([
      this.postDraftsDaf.delete(draft.id),
      this.createHistoryUseCase.execute({
        postId: post.id,
        action: 'edited',
        userId,
      }),
    ]);
  }
}
