import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '../../../database/in-memory-blog-categories-daf';
import { EditBlogCategoryUseCase } from '@/use-cases/blog/categories/edit-category';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import type { BlogCategory } from '@/entities/blog-category';
import { makeCategory } from '../../../factories/make-category';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

let categoriesDaf: InMemoryBlogCategoriesDAF;
let sut: EditBlogCategoryUseCase;
let category: BlogCategory;

describe('Edit Category Use Case', () => {
  beforeEach(async () => {
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    sut = new EditBlogCategoryUseCase(categoriesDaf);
    category = makeCategory();
    await categoriesDaf.create(category);
  });

  it('should be able to edit a category', async () => {
    const result = await sut.execute({
      categoryId: category.id,
      name: 'News',
    });

    expect(result.category.name).toEqual('News');
  });

  it('should be able to edit a category with wrong id', async () => {
    await expect(
      sut.execute({
        categoryId: 'non-existing-id',
        name: 'News',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a category with name that already in use', async () => {
    await categoriesDaf.create(makeCategory({ name: 'Articles' }));

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        name: 'Articles',
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });
});
