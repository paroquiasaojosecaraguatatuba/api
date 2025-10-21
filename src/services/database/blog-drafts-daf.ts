import type { BlogDraft } from '@/entities/blog-draft';

export interface BlogDraftsDAF {
  findById: (id: string) => Promise<BlogDraft | null>;
  findByTitleAndCategory: (data: {
    title: string;
    categoryId: string;
  }) => Promise<BlogDraft | null>;
  findBySlug: (slug: string) => Promise<BlogDraft | null>;
  findMany: (data: { page: number }) => Promise<BlogDraft[]>;
  create: (draft: BlogDraft) => Promise<void>;
  save: (draft: BlogDraft) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
