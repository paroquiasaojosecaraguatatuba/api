import { faker } from '@faker-js/faker';
import { ulid } from 'serverless-crypto-utils/id-generation';
import type { Clergy } from '@/entities/clergy';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface MakeClergyParams extends Partial<Omit<Clergy, 'photoId'>> {
  photoId: string;
}

export function makeClergy({ photoId, ...override }: MakeClergyParams): Clergy {
  const title = override.title || faker.person.prefix();
  const name = faker.person.fullName();
  const slug = makeSlug(title.concat(' ', name));

  return {
    id: ulid(),
    title,
    position: 'permanent_deacon',
    name,
    slug,
    photoId,
    createdAt: new Date().toISOString(),
    ...override,
  };
}
