import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogPostDraftsDAF } from '@/services/database/d1/d1-blog-post-drafts-daf';
import { EditBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/edit-post-draft';

export function makeEditBlogPostDraftUseCase(c: DomainContext) {
  const postDraftDaf = new D1BlogPostDraftsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createDraftUseCase = new EditBlogPostDraftUseCase(
    postDraftDaf,
    attachmentsDaf,
  );

  return createDraftUseCase;
}
