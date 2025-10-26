import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface UnpublishBlogPostUseCaseRequest {
  postId: string;
  userId: string;
  userRole: string;
}

export class UnpublishBlogPostUseCase {
  constructor(private blogPostDaf: BlogPostDAF) {}

  async execute({
    postId,
    userId,
    userRole,
  }: UnpublishBlogPostUseCaseRequest): Promise<void> {
    const post = await this.blogPostDaf.findById(postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    if (post.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    post.unpublishedAt = new Date().toISOString();
    post.updatedAt = new Date().toISOString();

    await this.blogPostDaf.save(post);
  }
}
