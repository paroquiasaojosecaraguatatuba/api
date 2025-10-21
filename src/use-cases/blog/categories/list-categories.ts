import type { BlogCategory } from '@/entities/blog-category';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';

interface ListBlogCategoriesUseCaseResponse {
  categories: BlogCategory[];
}

export class ListBlogCategoriesUseCase {
  constructor(private categoriesDaf: BlogCategoriesDAF) {}

  async execute(): Promise<ListBlogCategoriesUseCaseResponse> {
    const categories = await this.categoriesDaf.findAll();
    return { categories };
  }
}
