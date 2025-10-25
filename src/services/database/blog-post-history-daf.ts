import type { BlogPostHistory } from '@/entities/blog-post-history';

export interface BlogPostHistoryDAF {
  create(blogPostHistory: BlogPostHistory): Promise<void>;
}
