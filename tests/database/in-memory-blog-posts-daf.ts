import type { BlogPost } from '@/entities/blog-post';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';

export class InMemoryBlogPostsDAF implements BlogPostDAF {
  public posts: BlogPost[] = [];

  async findById(id: string): Promise<BlogPost | null> {
    const post = this.posts.find((post) => post.id === id);
    return post || null;
  }

  async findByTitleAndCategory({
    title,
    categoryId,
  }: {
    title: string;
    categoryId: string;
  }): Promise<BlogPost | null> {
    const post = this.posts.find(
      (post) => post.title === title && post.categoryId === categoryId,
    );
    return post || null;
  }

  async findMany(data: {
    page: number;
    categoryId: string;
  }): Promise<BlogPost[]> {
    const limit = 10;
    const offset = (data.page - 1) * limit;

    return this.posts
      .filter((post) => post.categoryId === data.categoryId)
      .slice(offset, offset + limit);
  }

  async create(post: BlogPost): Promise<void> {
    this.posts.push(post);
  }

  async save(post: BlogPost): Promise<void> {
    const index = this.posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      this.posts[index] = post;
    }
  }
}
