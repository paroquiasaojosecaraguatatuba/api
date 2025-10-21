import { D1BlogCategoriesDAF } from '@/services/database/d1/d1-blog-categories.daf';
import { EditBlogCategoryUseCase } from '@/use-cases/blog/categories/edit-category';

export function makeEditCategoryUseCase(c: DomainContext) {
  const categoryDaf = new D1BlogCategoriesDAF(c.env.DB);
  const useCase = new EditBlogCategoryUseCase(categoryDaf);

  return useCase;
}
