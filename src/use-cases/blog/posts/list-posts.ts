import type { BlogPostDAF } from '@/services/database/blog-posts-daf';

interface ListBlogPostsUseCaseRequest {
  page: number;
}

export class ListBlogPostsUseCase {
  constructor(private postsDaf: BlogPostDAF) {}

  async execute({ page }: ListBlogPostsUseCaseRequest) {
    const posts = await this.postsDaf.findMany({ page });

    return { posts };
  }
}
