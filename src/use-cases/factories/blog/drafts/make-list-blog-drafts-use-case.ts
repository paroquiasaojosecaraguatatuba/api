import { D1BlogDraftsDAF } from '@/services/database/d1/d1-blog-drafts-daf';
import { ListBlogDraftsUseCase } from '@/use-cases/blog/drafts/list-drafts';

export function makeListBlogDraftsUseCase(c: DomainContext) {
  const draftDaf = new D1BlogDraftsDAF(c.env.DB);
  const useCase = new ListBlogDraftsUseCase(draftDaf);

  return useCase;
}
