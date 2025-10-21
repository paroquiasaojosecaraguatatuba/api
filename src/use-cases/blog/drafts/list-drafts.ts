import type { BlogDraft } from '@/entities/blog-draft';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';

interface ListBlogDraftsUseCaseRequest {
  page: number;
}

interface ListBlogDraftsUseCaseResponse {
  drafts: BlogDraft[];
}

export class ListBlogDraftsUseCase {
  constructor(private draftDaf: BlogDraftsDAF) {}

  async execute({
    page,
  }: ListBlogDraftsUseCaseRequest): Promise<ListBlogDraftsUseCaseResponse> {
    const drafts = await this.draftDaf.findMany({ page });

    return { drafts };
  }
}
