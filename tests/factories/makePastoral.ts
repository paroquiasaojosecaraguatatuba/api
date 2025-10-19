import { faker } from '@faker-js/faker';
import { ulid } from 'serverless-crypto-utils/id-generation';
import type { Pastoral } from '@/entities/pastoral';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface MakePastoralParams extends Partial<Omit<Pastoral, 'coverId'>> {
  coverId: string;
}

export function makePastoral({
  coverId,
  ...override
}: MakePastoralParams): Pastoral {
  const name = faker.lorem.sentence();
  const slug = makeSlug(name);

  return {
    id: ulid(),
    coverId,
    name,
    slug,
    description: faker.lorem.paragraph(),
    responsibleName: faker.person.fullName(),
    contactPhone: faker.phone.number(),
    active: true,
    createdAt: new Date().toISOString(),
    ...override,
  };
}
