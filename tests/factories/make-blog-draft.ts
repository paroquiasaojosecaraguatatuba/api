import type { BlogDraft } from '@/entities/blog-draft';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';
import { faker } from '@faker-js/faker';

type Override = Partial<BlogDraft>;

export function makeBlogDraft(override: Override = {}): BlogDraft {
  const title = override.title ?? faker.lorem.sentence();
  return {
    id: makeId(),
    title,
    slug: makeSlug(title),
    content: faker.lorem.paragraphs(3),
    excerpt: faker.lorem.sentences(2),
    authorId: makeId(),
    coverId: makeId(),
    categoryId: makeId(),
    createdAt: new Date().toISOString(),
    ...override,
  };
}
