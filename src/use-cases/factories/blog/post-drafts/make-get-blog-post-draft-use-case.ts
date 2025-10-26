import { D1BlogPostDraftsDAF } from '@/services/database/d1/d1-blog-post-drafts-daf';
import { GetBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/get-post-draft';

export function makeGetBlogPostDraftUseCase(c: DomainContext) {
  const postDraftDaf = new D1BlogPostDraftsDAF(c.env.DB);
  const useCase = new GetBlogPostDraftUseCase(postDraftDaf);

  return useCase;
}
