import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '../../../database/in-memory-blog-categories-daf';
import { DeleteBlogCategoryUseCase } from '@/use-cases/blog/categories/delete-category';
import type { BlogCategory } from '@/entities/blog-category';
import { makeBlogCategory } from '../../../factories/make-blog-category';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

let categoriesDaf: InMemoryBlogCategoriesDAF;
let sut: DeleteBlogCategoryUseCase;
let category: BlogCategory;

describe('Delete Category Use Case', () => {
  beforeEach(async () => {
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    sut = new DeleteBlogCategoryUseCase(categoriesDaf);
    category = makeBlogCategory();
    await categoriesDaf.create(category);
  });

  it('should be able to delete a category', async () => {
    await sut.execute({
      categoryId: category.id,
    });

    const deletedCategory = await categoriesDaf.findById(category.id);

    expect(deletedCategory).toBeNull();
  });

  it('should be able to delete a category with wrong id', async () => {
    await expect(
      sut.execute({
        categoryId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
