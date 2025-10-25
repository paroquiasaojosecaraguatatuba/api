import type { BlogPostHistory } from '@/entities/blog-post-history';
import type { BlogPostHistoryDAF } from '../blog-post-history-daf';

export class D1BlogPostHistoryDAF implements BlogPostHistoryDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async create(blogPostHistory: BlogPostHistory): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO blog_post_history (id, post_id, action, user_id, changes_summary, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        blogPostHistory.id,
        blogPostHistory.postId,
        blogPostHistory.action,
        blogPostHistory.userId,
        blogPostHistory.changesSummary || null,
        blogPostHistory.createdAt,
      )
      .run();
  }
}
