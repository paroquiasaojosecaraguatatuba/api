import { D1BlogDraftsDAF } from '@/services/database/d1/d1-blog-drafts-daf';
import { GetBlogDraftUseCase } from '@/use-cases/blog/drafts/get-draft';

export function makeGetBlogDraftsUseCase(c: DomainContext) {
  const draftDaf = new D1BlogDraftsDAF(c.env.DB);
  const useCase = new GetBlogDraftUseCase(draftDaf);

  return useCase;
}
