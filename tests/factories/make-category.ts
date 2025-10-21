import type { BlogCategory } from '@/entities/blog-category';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';
import { faker } from '@faker-js/faker';

type Override = Partial<BlogCategory>;

export function makeCategory(override: Override = {}): BlogCategory {
  const name = override.name ?? faker.lorem.sentence();
  return {
    id: makeId(),
    name: faker.lorem.sentence(),
    slug: makeSlug(name),
    createdAt: new Date().toISOString(),
    ...override,
  };
}
