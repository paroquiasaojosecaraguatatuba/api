import { D1BlogCategoriesDAF } from '@/services/database/d1/d1-blog-categories.daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { ListBlogPostsUseCase } from '@/use-cases/blog/posts/list-posts';

export function makeListBlogPostsUseCase(c: DomainContext) {
  const postsDaf = new D1BlogPostsDAF(c.env.DB);
  const categoriesDaf = new D1BlogCategoriesDAF(c.env.DB);

  const useCase = new ListBlogPostsUseCase(postsDaf, categoriesDaf);

  return useCase;
}
