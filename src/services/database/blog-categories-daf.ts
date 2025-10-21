import type { BlogCategory } from '@/entities/blog-category';

export interface BlogCategoriesDAF {
  findById(id: string): Promise<BlogCategory | null>;
  findByName(name: string): Promise<BlogCategory | null>;
  findBySlug(slug: string): Promise<BlogCategory | null>;
  findAll(): Promise<BlogCategory[]>;
  create(blogCategory: BlogCategory): Promise<void>;
  save(blogCategory: BlogCategory): Promise<void>;
  delete(id: string): Promise<void>;
}
