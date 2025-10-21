import type { BlogCategory } from '@/entities/blog-category';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface EditBlogCategoryUseCaseRequest {
  categoryId: string;
  name: string;
}

interface EditBlogCategoryUseCaseResponse {
  category: BlogCategory;
}

export class EditBlogCategoryUseCase {
  constructor(private categoriesDaf: BlogCategoriesDAF) {}

  async execute({
    categoryId,
    name,
  }: EditBlogCategoryUseCaseRequest): Promise<EditBlogCategoryUseCaseResponse> {
    const category = await this.categoriesDaf.findById(categoryId);

    if (!category) {
      throw new ResourceNotFoundError();
    }

    if (category.name !== name) {
      const categoryWithSameName = await this.categoriesDaf.findByName(name);

      if (categoryWithSameName) {
        throw new NameAlreadyExistsError();
      }
    }

    category.name = name;
    category.slug = makeSlug(name);
    category.updatedAt = new Date().toISOString();

    await this.categoriesDaf.save(category);

    return {
      category,
    };
  }
}
