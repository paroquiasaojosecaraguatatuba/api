import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogCategoriesDAF } from '@/services/database/d1/d1-blog-categories.daf';
import { D1BlogDraftsDAF } from '@/services/database/d1/d1-blog-drafts-daf';
import { CreateBlogDraftUseCase } from '@/use-cases/blog/drafts/create-draft';

export function makeCreateBlogDraftUseCase(c: DomainContext) {
  const draftDaf = new D1BlogDraftsDAF(c.env.DB);
  const categoriesDaf = new D1BlogCategoriesDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createDraftUseCase = new CreateBlogDraftUseCase(
    draftDaf,
    categoriesDaf,
    attachmentsDaf,
  );

  return createDraftUseCase;
}
