import type { BlogDraft } from '@/entities/blog-draft';
import type { BlogDraftsDAF } from '../blog-drafts-daf';

export class D1BlogDraftsDAF implements BlogDraftsDAF {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async findById(id: string): Promise<BlogDraft | null> {
    const draft = await this.db
      .prepare('SELECT * FROM blog_drafts WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!draft) {
      return null;
    }

    return {
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      content: draft.content,
      excerpt: draft.excerpt,
      eventDate: draft.event_date || undefined,
      scheduledPublishAt: draft.scheduled_publish_at || undefined,
      scheduledUnpublishAt: draft.scheduled_unpublish_at || undefined,
      coverId: draft.cover_id,
      categoryId: draft.category_id,
      authorId: draft.author_id,
      createdAt: draft.created_at,
      updatedAt: draft.updated_at,
    };
  }

  async findByTitleAndCategory({
    title,
    categoryId,
  }: {
    title: string;
    categoryId: string;
  }): Promise<BlogDraft | null> {
    const draft = await this.db
      .prepare('SELECT * FROM blog_drafts WHERE title = ? AND category_id = ?')
      .bind(title, categoryId)
      .first<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!draft) {
      return null;
    }

    return {
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      content: draft.content,
      excerpt: draft.excerpt,
      eventDate: draft.event_date || undefined,
      scheduledPublishAt: draft.scheduled_publish_at || undefined,
      scheduledUnpublishAt: draft.scheduled_unpublish_at || undefined,
      coverId: draft.cover_id,
      categoryId: draft.category_id,
      authorId: draft.author_id,
      createdAt: draft.created_at,
      updatedAt: draft.updated_at,
    };
  }

  async findBySlug(slug: string): Promise<BlogDraft | null> {
    const draft = await this.db
      .prepare('SELECT * FROM blog_drafts WHERE slug = ?')
      .bind(slug)
      .first<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!draft) {
      return null;
    }

    return {
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      content: draft.content,
      excerpt: draft.excerpt,
      eventDate: draft.event_date || undefined,
      scheduledPublishAt: draft.scheduled_publish_at || undefined,
      scheduledUnpublishAt: draft.scheduled_unpublish_at || undefined,
      coverId: draft.cover_id,
      categoryId: draft.category_id,
      authorId: draft.author_id,
      createdAt: draft.created_at,
      updatedAt: draft.updated_at,
    };
  }

  async findMany(data: { page: number }): Promise<BlogDraft[]> {
    const drafts = await this.db
      .prepare(
        'SELECT * FROM blog_drafts ORDER BY created_at DESC LIMIT 10 OFFSET ?',
      )
      .bind((data.page - 1) * 10)
      .all<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        scheduled_publish_at: string | null;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string;
      }>();

    return drafts.results.map((draft) => ({
      id: draft.id,
      title: draft.title,
      slug: draft.slug,
      content: draft.content,
      excerpt: draft.excerpt,
      eventDate: draft.event_date || undefined,
      scheduledPublishAt: draft.scheduled_publish_at || undefined,
      scheduledUnpublishAt: draft.scheduled_unpublish_at || undefined,
      coverId: draft.cover_id,
      categoryId: draft.category_id,
      authorId: draft.author_id,
      createdAt: draft.created_at,
      updatedAt: draft.updated_at,
    }));
  }

  async create(draft: BlogDraft): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO blog_drafts
      (id, title, slug, content, excerpt, event_date, scheduled_publish_at, scheduled_unpublish_at, cover_id, category_id, author_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        draft.id,
        draft.title,
        draft.slug,
        draft.content,
        draft.excerpt,
        draft.eventDate || null,
        draft.scheduledPublishAt || null,
        draft.scheduledUnpublishAt || null,
        draft.coverId,
        draft.categoryId,
        draft.authorId,
        draft.createdAt,
      )
      .run();
  }

  async save(draft: BlogDraft): Promise<void> {
    await this.db
      .prepare(
        `UPDATE blog_drafts SET
      title = ?, slug = ?, content = ?, excerpt = ?, event_date = ?, scheduled_publish_at = ?, scheduled_unpublish_at = ?, cover_id = ?, category_id = ?, author_id = ?, updated_at = ?
      WHERE id = ?`,
      )
      .bind(
        draft.title,
        draft.slug,
        draft.content,
        draft.excerpt,
        draft.eventDate || null,
        draft.scheduledPublishAt || null,
        draft.scheduledUnpublishAt || null,
        draft.coverId,
        draft.categoryId,
        draft.authorId,
        draft.updatedAt,
        draft.id,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM blog_drafts WHERE id = ?')
      .bind(id)
      .run();
  }
}
