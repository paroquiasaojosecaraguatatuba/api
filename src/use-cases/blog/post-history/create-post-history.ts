import type { BlogPostHistory } from '@/entities/blog-post-history';
import type { BlogPostHistoryDAF } from '@/services/database/blog-post-history-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeId } from '@/use-cases/factories/make-id';

interface CreateBlogPostHistoryUseCaseRequest {
  postId: string;
  action: 'published' | 'unpublished' | 'edited';
  userId: string;
  changesSummary?: string;
}

interface CreateBlogPostHistoryUseCaseResponse {
  postHistory: BlogPostHistory;
}

export class CreateBlogPostHistoryUseCase {
  constructor(
    private blogPostHistoryDAF: BlogPostHistoryDAF,
    private blogPostDAF: BlogPostDAF,
  ) {}

  async execute({
    postId,
    action,
    userId,
    changesSummary,
  }: CreateBlogPostHistoryUseCaseRequest): Promise<CreateBlogPostHistoryUseCaseResponse> {
    const post = await this.blogPostDAF.findById(postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    const postHistory = {
      id: makeId(),
      postId,
      action,
      userId,
      changesSummary,
      createdAt: new Date().toISOString(),
    };

    await this.blogPostHistoryDAF.create(postHistory);

    return { postHistory };
  }
}
