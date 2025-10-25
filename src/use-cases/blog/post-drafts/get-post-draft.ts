import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { BlogPostDraftsDAF } from '@/services/database/blog-post-drafts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface GetPostDraftUseCaseRequest {
  postId: string;
}

interface GetPostDraftUseCaseResponse {
  postDraft: BlogPostDraft;
}

export class GetPostDraftUseCase {
  constructor(private postDraftsDaf: BlogPostDraftsDAF) {}

  async execute({
    postId,
  }: GetPostDraftUseCaseRequest): Promise<GetPostDraftUseCaseResponse> {
    const postDraft = await this.postDraftsDaf.findByPostId(postId);

    if (!postDraft) {
      throw new ResourceNotFoundError();
    }

    return { postDraft };
  }
}
