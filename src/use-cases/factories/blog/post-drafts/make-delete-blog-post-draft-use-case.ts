import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogPostDraftsDAF } from '@/services/database/d1/d1-blog-post-drafts-daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { DeleteBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/delete-post-draft';

export function makeDeleteBlogPostDraftUseCase(c: DomainContext) {
  const postDraftDaf = new D1BlogPostDraftsDAF(c.env.DB);
  const postDaf = new D1BlogPostsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);

  const useCase = new DeleteBlogPostDraftUseCase(
    postDraftDaf,
    postDaf,
    attachmentsDaf,
  );

  return useCase;
}
