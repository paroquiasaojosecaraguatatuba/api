import { getAppContext } from '@/http/utils/getAppContext';
import { useSlugSchema } from '@/schemas/blog/use-slug-schema';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeGetBlogDraftsUseCase } from '@/use-cases/factories/blog/drafts/make-get-blog-draft-use-case';

export const getDraft: ControllerFn = async (c) => {
  const { t, params } = getAppContext(c);

  const { slug } = useSlugSchema(t).parse(params);

  const getUseCase = makeGetBlogDraftsUseCase(c);

  try {
    const { draft } = await getUseCase.execute({
      slug,
    });

    return c.json({ draft });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-draft-not-found') }, 404);
    }

    throw err;
  }
};
