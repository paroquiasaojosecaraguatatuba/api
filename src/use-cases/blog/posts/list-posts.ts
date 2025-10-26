import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import type { BlogPostDAF } from '@/services/database/blog-posts-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface ListBlogPostsUseCaseRequest {
  page: number;
  categorySlug: string;
}

export class ListBlogPostsUseCase {
  constructor(
    private postsDaf: BlogPostDAF,
    private categoriesDaf: BlogCategoriesDAF,
  ) {}

  async execute({ page, categorySlug }: ListBlogPostsUseCaseRequest) {
    const category = await this.categoriesDaf.findBySlug(categorySlug);

    if (!category) {
      throw new ResourceNotFoundError();
    }

    const posts = await this.postsDaf.findMany({
      page,
      categoryId: category.id,
    });

    return { posts };
  }
}
