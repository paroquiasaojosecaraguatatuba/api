import { D1BlogPostHistoryDAF } from '@/services/database/d1/d1-blog-post-history-daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { CreateBlogPostHistoryUseCase } from '@/use-cases/blog/post-history/create-post-history';

export const makeCreateBlogPostHistoryUseCase = (c: DomainContext) => {
  const postsDaf = new D1BlogPostsDAF(c.env.DB);
  const postHistoryDaf = new D1BlogPostHistoryDAF(c.env.DB);

  const useCase = new CreateBlogPostHistoryUseCase(postHistoryDaf, postsDaf);

  return useCase;
};
