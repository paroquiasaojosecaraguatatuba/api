import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogPostDraftsDAF } from '@/services/database/d1/d1-blog-post-drafts-daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { CreateBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/create-post-draft';

export function makeCreateBlogPostDraftUseCase(c: DomainContext) {
  const postEditDaf = new D1BlogPostDraftsDAF(c.env.DB);
  const postDaf = new D1BlogPostsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createDraftUseCase = new CreateBlogPostDraftUseCase(
    postEditDaf,
    postDaf,
    attachmentsDaf,
  );

  return createDraftUseCase;
}
