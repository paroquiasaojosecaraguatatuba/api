import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface GetBlogPostDraftUseCaseRequest {
  postDraftId: string;
}

interface GetBlogPostDraftUseCaseResponse {
  postDraft: BlogPostDraft;
}

export class GetBlogPostDraftUseCase {
  constructor(private postDraftsDaf: BlogPostDraftsDAF) {}

  async execute({
    postDraftId,
  }: GetBlogPostDraftUseCaseRequest): Promise<GetBlogPostDraftUseCaseResponse> {
    const postDraft = await this.postDraftsDaf.findById(postDraftId);

    if (!postDraft) {
      throw new ResourceNotFoundError();
    }

    return { postDraft };
  }
}
