import type { BlogPostDraft } from '@/entities/blog-post-draft';
import type { BlogPostDraftsDAF } from '../blog-post-drafts-daf';

export class D1BlogPostDraftsDAF implements BlogPostDraftsDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string): Promise<BlogPostDraft | null> {
    const result = await this.d1
      .prepare('SELECT * FROM blog_post_drafts WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        post_id: string;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        last_auto_save_at: string;
        author_id: string;
        created_at: string;
      }>();

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      postId: result.post_id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      eventDate: result.event_date ?? undefined,
      scheduledPublishAt: result.scheduled_publish_at ?? undefined,
      scheduledUnpublishAt: result.scheduled_unpublish_at ?? undefined,
      coverId: result.cover_id,
      lastAutoSaveAt: result.last_auto_save_at,
      authorId: result.author_id,
      createdAt: result.created_at,
    };
  }

  async findByPostId(postId: string): Promise<BlogPostDraft | null> {
    const result = await this.d1
      .prepare('SELECT * FROM blog_post_drafts WHERE post_id = ?')
      .bind(postId)
      .first<{
        id: string;
        post_id: string;
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        last_auto_save_at: string;
        author_id: string;
        created_at: string;
      }>();

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      postId: result.post_id,
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      eventDate: result.event_date ?? undefined,
      scheduledPublishAt: result.scheduled_publish_at ?? undefined,
      scheduledUnpublishAt: result.scheduled_unpublish_at ?? undefined,
      coverId: result.cover_id,
      lastAutoSaveAt: result.last_auto_save_at,
      authorId: result.author_id,
      createdAt: result.created_at,
    };
  }

  async create({
    id,
    content,
    coverId,
    excerpt,
    lastAutoSaveAt,
    postId,
    slug,
    title,
    eventDate,
    scheduledPublishAt,
    scheduledUnpublishAt,
    authorId,
    createdAt,
  }: BlogPostDraft): Promise<void> {
    await this.d1
      .prepare(
        `
      INSERT INTO blog_post_drafts (
        id,
        post_id,
        title,
        slug,
        excerpt,
        content,
        event_date,
        scheduled_publish_at,
        scheduled_unpublish_at,
        cover_id,
        last_auto_save_at,
        author_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .bind(
        id,
        postId,
        title,
        slug,
        excerpt,
        content,
        eventDate ?? null,
        scheduledPublishAt ?? null,
        scheduledUnpublishAt ?? null,
        coverId,
        lastAutoSaveAt,
        authorId,
        createdAt,
      )
      .run();
  }

  async save(BlogPostDraft: BlogPostDraft): Promise<void> {
    await this.d1
      .prepare(
        `
      UPDATE blog_post_drafts SET
        post_id = ?,
        title = ?,
        slug = ?,
        excerpt = ?,
        content = ?,
        event_date = ?,
        scheduled_publish_at = ?,
        scheduled_unpublish_at = ?,
        cover_id = ?,
        last_auto_save_at = ?,
        author_id = ?,
        created_at = ?
      WHERE id = ?
    `,
      )
      .bind(
        BlogPostDraft.postId,
        BlogPostDraft.title,
        BlogPostDraft.slug,
        BlogPostDraft.excerpt,
        BlogPostDraft.content,
        BlogPostDraft.eventDate ?? null,
        BlogPostDraft.scheduledPublishAt ?? null,
        BlogPostDraft.scheduledUnpublishAt ?? null,
        BlogPostDraft.coverId,
        BlogPostDraft.lastAutoSaveAt,
        BlogPostDraft.authorId,
        BlogPostDraft.createdAt,
        BlogPostDraft.id,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.d1
      .prepare('DELETE FROM blog_post_drafts WHERE id = ?')
      .bind(id)
      .run();
  }
}
