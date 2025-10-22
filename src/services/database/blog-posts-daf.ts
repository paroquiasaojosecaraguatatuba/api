import type { BlogPost } from '@/entities/blog-post';

export interface BlogPostDAF {
  findById(id: string): Promise<BlogPost | null>;
  findMany(data: { page: number }): Promise<BlogPost[]>;
  create(post: BlogPost): Promise<void>;
}
