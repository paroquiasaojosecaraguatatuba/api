import { getAppContext } from '@/http/utils/getAppContext';
import { useCategorySchema } from '@/schemas/blog/useCategorySchema';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { makeEditCategoryUseCase } from '@/use-cases/factories/blog/categories/make-edit-category-use-case';

export const editCategory: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const validationSchema = useCategorySchema(t);

  const { id } = params;

  const { name } = validationSchema.parse(inputs);

  try {
    const editUseCase = makeEditCategoryUseCase(c);

    const { category } = await editUseCase.execute({
      categoryId: id,
      name,
    });

    return c.json({ category });
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-category-name-already-in-use') }, 400);
    }

    throw err;
  }
};
