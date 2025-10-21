import { D1BlogCategoriesDAF } from '@/services/database/d1/d1-blog-categories.daf';
import { DeleteBlogCategoryUseCase } from '@/use-cases/blog/categories/delete-category';

export function makeDeleteCategoryUseCase(c: DomainContext) {
  const categoryDaf = new D1BlogCategoriesDAF(c.env.DB);
  const useCase = new DeleteBlogCategoryUseCase(categoryDaf);

  return useCase;
}
