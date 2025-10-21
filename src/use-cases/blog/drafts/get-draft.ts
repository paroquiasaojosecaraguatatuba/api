import type { BlogDraft } from '@/entities/blog-draft';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface GetBlogDraftUseCaseRequest {
  slug: string;
}

interface GetBlogDraftUseCaseResponse {
  draft: BlogDraft;
}

export class GetBlogDraftUseCase {
  constructor(private draftDaf: BlogDraftsDAF) {}

  async execute({
    slug,
  }: GetBlogDraftUseCaseRequest): Promise<GetBlogDraftUseCaseResponse> {
    const draft = await this.draftDaf.findBySlug(slug);

    if (!draft) {
      throw new ResourceNotFoundError();
    }

    return { draft };
  }
}
