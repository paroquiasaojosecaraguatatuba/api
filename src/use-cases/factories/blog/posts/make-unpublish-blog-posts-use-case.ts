import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { UnpublishBlogPostUseCase } from '@/use-cases/blog/posts/unpublish-post';

export function makeUnpublishBlogPostsUseCase(c: DomainContext) {
  const postsDaf = new D1BlogPostsDAF(c.env.DB);

  const useCase = new UnpublishBlogPostUseCase(postsDaf);

  return useCase;
}
