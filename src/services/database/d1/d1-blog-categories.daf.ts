import type { BlogCategory } from '@/entities/blog-category';
import type { BlogCategoriesDAF } from '../blog-categories-daf';

export class D1BlogCategoriesDAF implements BlogCategoriesDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string): Promise<BlogCategory | null> {
    const category = await this.d1
      .prepare('SELECT * FROM blog_categories WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  async findByName(name: string): Promise<BlogCategory | null> {
    const category = await this.d1
      .prepare('SELECT * FROM blog_categories WHERE name = ?')
      .bind(name)
      .first<{
        id: string;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  async findBySlug(slug: string): Promise<BlogCategory | null> {
    const category = await this.d1
      .prepare('SELECT * FROM blog_categories WHERE slug = ?')
      .bind(slug)
      .first<{
        id: string;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!category) {
      return null;
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  }

  async findAll(): Promise<BlogCategory[]> {
    const categories = await this.d1
      .prepare('SELECT * FROM blog_categories')
      .all<{
        id: string;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
      }>();

    return categories.results.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  }

  async create({ id, name, slug, createdAt }: BlogCategory): Promise<void> {
    await this.d1
      .prepare(
        'INSERT INTO blog_categories (id, name, slug, created_at) VALUES (?, ?, ?, ?)',
      )
      .bind(id, name, slug, createdAt)
      .run();
  }

  async save({ id, name, slug, updatedAt }: BlogCategory): Promise<void> {
    await this.d1
      .prepare(
        'UPDATE blog_categories SET name = ?, slug = ?, updated_at = ? WHERE id = ?',
      )
      .bind(name, slug, updatedAt, id)
      .run();
  }

  async delete(id: string): Promise<void> {
    return this.d1
      .prepare('DELETE FROM blog_categories WHERE id = ?')
      .bind(id)
      .run()
      .then(() => {});
  }
}
