import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface DeleteBlogCategoryUseCaseRequest {
  categoryId: string;
}

export class DeleteBlogCategoryUseCase {
  constructor(private categoriesDaf: BlogCategoriesDAF) {}

  async execute({
    categoryId,
  }: DeleteBlogCategoryUseCaseRequest): Promise<void> {
    const category = await this.categoriesDaf.findById(categoryId);

    if (!category) {
      throw new ResourceNotFoundError();
    }

    await this.categoriesDaf.delete(categoryId);
  }
}
