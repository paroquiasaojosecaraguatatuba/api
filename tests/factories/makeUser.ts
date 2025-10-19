import { faker } from '@faker-js/faker';
import { ulid } from 'serverless-crypto-utils/id-generation';
import type { User } from '@/entities/user';
import { hashPassword } from 'serverless-crypto-utils';

interface MakeUserParams extends Partial<Omit<User, 'passwordHash'>> {
  password?: string;
}

export async function makeUser({
  password,
  ...override
}: MakeUserParams = {}): Promise<User> {
  return {
    id: ulid(),
    email: faker.internet.email(),
    passwordHash: await hashPassword(password || faker.internet.password()),
    role: 'user',
    ...override,
  };
}
