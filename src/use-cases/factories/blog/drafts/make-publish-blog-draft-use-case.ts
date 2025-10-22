import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogDraftsDAF } from '@/services/database/d1/d1-blog-drafts-daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { PublishBlogDraftUseCase } from '@/use-cases/blog/drafts/publish-draft';

export function makePublishBlogDraftUseCase(c: DomainContext) {
  const draftsDaf = new D1BlogDraftsDAF(c.env.DB);
  const postsDaf = new D1BlogPostsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const useCase = new PublishBlogDraftUseCase(
    draftsDaf,
    postsDaf,
    attachmentsDaf,
  );

  return useCase;
}
