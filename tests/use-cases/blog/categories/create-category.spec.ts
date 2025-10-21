import { describe, beforeEach, it, expect } from 'vitest';
import { InMemoryBlogCategoriesDAF } from '../../../database/in-memory-blog-categories-daf';
import { CreateBlogCategoryUseCase } from '@/use-cases/blog/categories/create-category';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';

let categoriesDaf: InMemoryBlogCategoriesDAF;
let sut: CreateBlogCategoryUseCase;

describe('Create Category Use Case', () => {
  beforeEach(async () => {
    categoriesDaf = new InMemoryBlogCategoriesDAF();
    sut = new CreateBlogCategoryUseCase(categoriesDaf);
  });

  it('should be able to create a category', async () => {
    const { category } = await sut.execute({
      name: 'News',
    });

    expect(category.id).toBeDefined();
  });

  it('should not be able to create a category with same name twice', async () => {
    await sut.execute({
      name: 'Articles',
    });

    await expect(() =>
      sut.execute({
        name: 'Articles',
      }),
    ).rejects.toBeInstanceOf(NameAlreadyExistsError);
  });
});
