import { getAppContext } from '@/http/utils/getAppContext';
import { useCategorySchema } from '@/schemas/blog/useCategorySchema';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { makeCreateCategoryUseCase } from '@/use-cases/factories/blog/categories/make-create-category-use-case';

export const createCategory: ControllerFn = async (c) => {
  const { t, inputs } = getAppContext(c);

  const validationSchema = useCategorySchema(t);

  const { name } = validationSchema.parse(inputs);

  try {
    const createUseCase = makeCreateCategoryUseCase(c);

    const { category } = await createUseCase.execute({
      name,
    });

    return c.json(category);
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-category-name-already-in-use') }, 400);
    }

    throw err;
  }
};
