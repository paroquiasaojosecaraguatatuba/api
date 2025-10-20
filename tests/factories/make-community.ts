import { faker } from '@faker-js/faker';
import { ulid } from 'serverless-crypto-utils/id-generation';
import type { Community } from '@/entities/community';
import { makeSlug } from '@/use-cases/factories/make-slug';

interface MakeCommunityParams extends Partial<Omit<Community, 'coverId'>> {
  coverId: string;
}

export function makeCommunity({
  coverId,
  ...override
}: MakeCommunityParams): Community {
  const name = faker.lorem.sentence();
  const slug = makeSlug(name);

  return {
    id: ulid(),
    coverId,
    name,
    slug,
    type: 'chapel',
    address: faker.location.streetAddress(true),
    createdAt: new Date().toISOString(),
    ...override,
  };
}
