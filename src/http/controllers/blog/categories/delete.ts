import { getAppContext } from '@/http/utils/getAppContext';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeDeleteCategoryUseCase } from '@/use-cases/factories/blog/categories/make-delete-category-use-case';

export const deleteCategory: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { id } = params;

  try {
    const deleteUseCase = makeDeleteCategoryUseCase(c);

    await deleteUseCase.execute({
      categoryId: id,
    });

    return c.json(204);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-category-not-found') }, 404);
    }

    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-category-name-already-in-use') }, 400);
    }

    throw err;
  }
};
