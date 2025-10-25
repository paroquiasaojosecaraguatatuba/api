import type { BlogPostDraft } from '@/entities/blog-post-draft';
import { makeId } from '@/use-cases/factories/make-id';
import { makeSlug } from '@/use-cases/factories/make-slug';
import { faker } from '@faker-js/faker';

type Override = Partial<BlogPostDraft>;

export function makeBlogPostDraft(override: Override = {}): BlogPostDraft {
  const title = override.title ?? faker.lorem.sentence();
  return {
    id: makeId(),
    postId: makeId(),
    title,
    slug: makeSlug(title),
    content: faker.lorem.paragraphs(3),
    excerpt: faker.lorem.sentences(2),
    coverId: makeId(),
    authorId: makeId(),
    createdAt: new Date().toISOString(),
    ...override,
  };
}
