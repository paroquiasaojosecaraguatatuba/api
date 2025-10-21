import type { BlogCategory } from '@/entities/blog-category';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';

export class InMemoryBlogCategoriesDAF implements BlogCategoriesDAF {
  public categories: BlogCategory[] = [];

  async findById(id: string): Promise<BlogCategory | null> {
    const category = this.categories.find((c) => c.id === id);

    return category || null;
  }

  async findByName(name: string): Promise<BlogCategory | null> {
    const category = this.categories.find((c) => c.name === name);

    return category || null;
  }

  async findBySlug(slug: string): Promise<BlogCategory | null> {
    const category = this.categories.find((c) => c.slug === slug);

    return category || null;
  }

  async findAll(): Promise<BlogCategory[]> {
    return this.categories;
  }

  async create(blogCategory: BlogCategory): Promise<void> {
    this.categories.push(blogCategory);
  }

  async save(blogCategory: BlogCategory): Promise<void> {
    const index = this.categories.findIndex((c) => c.id === blogCategory.id);

    if (index >= 0) {
      this.categories[index] = blogCategory;
    }
  }

  async delete(id: string): Promise<void> {
    this.categories = this.categories.filter((c) => c.id !== id);
  }
}
