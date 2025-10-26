import type { BlogPost } from '@/entities/blog-post';
import type { BlogPostDAF } from '../blog-posts-daf';

export class D1BlogPostsDAF implements BlogPostDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string): Promise<BlogPost | null> {
    const post = await this.d1
      .prepare('SELECT * FROM blog_posts WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        published_at: string;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string | null;
      }>();

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      eventDate: post.event_date || undefined,
      publishedAt: post.published_at,
      scheduledUnpublishAt: post.scheduled_unpublish_at || undefined,
      coverId: post.cover_id,
      categoryId: post.category_id,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at || undefined,
    };
  }

  async findByTitleAndCategory({
    title,
    categoryId,
  }: {
    title: string;
    categoryId: string;
  }): Promise<BlogPost | null> {
    const post = await this.d1
      .prepare('SELECT * FROM blog_posts WHERE title = ? AND category_id = ?')
      .bind(title, categoryId)
      .first<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        published_at: string;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string | null;
      }>();

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      eventDate: post.event_date || undefined,
      publishedAt: post.published_at,
      scheduledUnpublishAt: post.scheduled_unpublish_at || undefined,
      coverId: post.cover_id,
      categoryId: post.category_id,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at || undefined,
    };
  }

  async findMany({
    page,
    categoryId,
  }: {
    page: number;
    categoryId: string;
  }): Promise<BlogPost[]> {
    const limit = 10;
    const offset = (page - 1) * limit;

    const posts = await this.d1
      .prepare(
        'SELECT * FROM blog_posts WHERE category_id = ? ORDER BY published_at DESC LIMIT ? OFFSET ?',
      )
      .bind(categoryId, limit, offset)
      .all<{
        id: string;
        title: string;
        slug: string;
        content: string;
        excerpt: string;
        event_date: string | null;
        published_at: string;
        scheduled_unpublish_at: string | null;
        cover_id: string;
        category_id: string;
        author_id: string;
        created_at: string;
        updated_at: string | null;
      }>();

    return posts.results.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      eventDate: post.event_date || undefined,
      publishedAt: post.published_at,
      scheduledUnpublishAt: post.scheduled_unpublish_at || undefined,
      coverId: post.cover_id,
      categoryId: post.category_id,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at || undefined,
    }));
  }

  async create(post: BlogPost): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO blog_posts (
          id, title, slug, content, excerpt, event_date,
          published_at, scheduled_unpublish_at, cover_id,
          category_id, author_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        post.id,
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.eventDate || null,
        post.publishedAt,
        post.scheduledUnpublishAt || null,
        post.coverId,
        post.categoryId,
        post.authorId,
        post.createdAt,
        post.updatedAt || null,
      )
      .run();
  }

  async save({
    id,
    title,
    slug,
    content,
    excerpt,
    eventDate,
    publishedAt,
    scheduledUnpublishAt,
    coverId,
    categoryId,
    authorId,
    createdAt,
    updatedAt,
    editId,
  }: BlogPost): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE blog_posts SET
          title = ?, slug = ?, content = ?, excerpt = ?, event_date = ?,
          published_at = ?, scheduled_unpublish_at = ?, cover_id = ?,
          category_id = ?, author_id = ?, created_at = ?, updated_at = ?, 
          edit_id = ?
        WHERE id = ?`,
      )
      .bind(
        title,
        slug,
        content,
        excerpt,
        eventDate || null,
        publishedAt,
        scheduledUnpublishAt || null,
        coverId,
        categoryId,
        authorId,
        createdAt,
        updatedAt || null,
        editId || null,
        id,
      )
      .run();
  }
}
