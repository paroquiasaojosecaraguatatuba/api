import { makeListCategoriesUseCase } from '@/use-cases/factories/blog/categories/make-list-categories-use-case';

export const listCategories: ControllerFn = async (c) => {
  const listCategoriesUseCase = makeListCategoriesUseCase(c);

  const { categories } = await listCategoriesUseCase.execute();

  return c.json({ categories });
};
