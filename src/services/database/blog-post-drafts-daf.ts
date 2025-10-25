import type { BlogPostDraft } from '@/entities/blog-post-draft';

export interface BlogPostDraftsDAF {
  findById(id: string): Promise<BlogPostDraft | null>;
  findByPostId(postId: string): Promise<BlogPostDraft | null>;
  create(blogPostDraft: BlogPostDraft): Promise<void>;
  save(blogPostDraft: BlogPostDraft): Promise<void>;
  delete(id: string): Promise<void>;
}
