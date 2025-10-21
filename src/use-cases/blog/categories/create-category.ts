import type { BlogCategory } from '@/entities/blog-category';
import type { BlogCategoriesDAF } from '@/services/database/blog-categories-daf';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface CreateBlogCategoryUseCaseRequest {
  name: string;
}

interface CreateBlogCategoryUseCaseResponse {
  category: BlogCategory;
}

export class CreateBlogCategoryUseCase {
  constructor(private categoriesDaf: BlogCategoriesDAF) {}

  async execute({
    name,
  }: CreateBlogCategoryUseCaseRequest): Promise<CreateBlogCategoryUseCaseResponse> {
    const categoryWithSameName = await this.categoriesDaf.findByName(name);

    if (categoryWithSameName) {
      throw new NameAlreadyExistsError();
    }

    const category = {
      id: makeId(),
      name,
      slug: makeSlug(name),
      createdAt: new Date().toISOString(),
    };

    await this.categoriesDaf.create(category);

    return {
      category,
    };
  }
}
