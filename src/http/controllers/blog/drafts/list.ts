import { getAppContext } from '@/http/utils/getAppContext';
import { usePaginationSchema } from '@/schemas/use-pagination-schema';
import { makeListBlogDraftsUseCase } from '@/use-cases/factories/blog/drafts/make-list-blog-drafts-use-case';

export const listDrafts: ControllerFn = async (c) => {
  const { t, queries } = getAppContext(c);

  const { page } = usePaginationSchema(t).parse(queries);

  const listUseCase = makeListBlogDraftsUseCase(c);

  const { drafts } = await listUseCase.execute({
    page,
  });

  return c.json({ drafts });
};
