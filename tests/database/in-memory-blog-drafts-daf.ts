import type { BlogDraft } from '@/entities/blog-draft';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';

export class InMemoryBlogDraftsDAF implements BlogDraftsDAF {
  public drafts: BlogDraft[] = [];

  async findById(id: string): Promise<BlogDraft | null> {
    const draft = this.drafts.find((draft) => draft.id === id);

    return draft || null;
  }

  async findByTitleAndCategory(data: {
    title: string;
    categoryId: string;
  }): Promise<BlogDraft | null> {
    const draft = this.drafts.find(
      (draft) =>
        draft.title === data.title && draft.categoryId === data.categoryId,
    );

    return draft || null;
  }

  async findBySlug(slug: string): Promise<BlogDraft | null> {
    const draft = this.drafts.find((draft) => draft.slug === slug);

    return draft || null;
  }

  async findMany(data: { page: number }): Promise<BlogDraft[]> {
    const itemsPerPage = 10;
    const startIndex = (data.page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return this.drafts.slice(startIndex, endIndex);
  }

  async create(draft: BlogDraft): Promise<void> {
    this.drafts.push(draft);
  }

  async save(draft: BlogDraft): Promise<void> {
    const draftIndex = this.drafts.findIndex((d) => d.id === draft.id);

    if (draftIndex >= 0) {
      this.drafts[draftIndex] = draft;
    }
  }

  async delete(id: string): Promise<void> {
    this.drafts = this.drafts.filter((draft) => draft.id !== id);
  }
}
