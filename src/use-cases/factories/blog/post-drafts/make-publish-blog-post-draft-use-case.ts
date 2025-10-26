import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1BlogPostDraftsDAF } from '@/services/database/d1/d1-blog-post-drafts-daf';
import { D1BlogPostHistoryDAF } from '@/services/database/d1/d1-blog-post-history-daf';
import { D1BlogPostsDAF } from '@/services/database/d1/d1-blog-posts-daf';
import { PublishBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/publish-post-draft';
import { CreateBlogPostHistoryUseCase } from '@/use-cases/blog/post-history/create-post-history';

export function makePublishBlogPostDraftUseCase(c: DomainContext) {
  const postDraftDaf = new D1BlogPostDraftsDAF(c.env.DB);
  const postsDaf = new D1BlogPostsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const historyDaf = new D1BlogPostHistoryDAF(c.env.DB);
  const historyUseCase = new CreateBlogPostHistoryUseCase(historyDaf, postsDaf);

  const publishUseCase = new PublishBlogPostDraftUseCase(
    postDraftDaf,
    postsDaf,
    attachmentsDaf,
    historyUseCase,
  );

  return publishUseCase;
}
