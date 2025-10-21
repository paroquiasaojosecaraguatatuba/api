import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogDraftsDAF } from '@/services/database/d1/d1-blog-drafts-daf';
import { DeleteBlogDraftUseCase } from '@/use-cases/blog/drafts/delete-draft';

export function makeDeleteBlogDraftUseCase(c: DomainContext) {
  const draftDaf = new D1BlogDraftsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const useCase = new DeleteBlogDraftUseCase(draftDaf, attachmentsDaf);

  return useCase;
}
