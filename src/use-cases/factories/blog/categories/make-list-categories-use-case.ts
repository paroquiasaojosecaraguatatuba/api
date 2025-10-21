import { D1BlogCategoriesDAF } from '@/services/database/d1/d1-blog-categories.daf';
import { ListBlogCategoriesUseCase } from '@/use-cases/blog/categories/list-categories';

export function makeListCategoriesUseCase(c: DomainContext) {
  const categoryDaf = new D1BlogCategoriesDAF(c.env.DB);
  const useCase = new ListBlogCategoriesUseCase(categoryDaf);

  return useCase;
}
