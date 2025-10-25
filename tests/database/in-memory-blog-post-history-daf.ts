import type { BlogPostHistory } from '@/entities/blog-post-history';
import type { BlogPostHistoryDAF } from '@/services/database/blog-post-history-daf';

export class InMemoryBlogPostHistoryDAF implements BlogPostHistoryDAF {
  public history: BlogPostHistory[] = [];

  async create(blogPostHistory: BlogPostHistory): Promise<void> {
    this.history.push(blogPostHistory);
  }
}
