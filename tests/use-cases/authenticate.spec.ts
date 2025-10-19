import { describe, beforeEach, it, expect } from 'vitest';
import { hashPassword } from 'serverless-crypto-utils/password-hashing';
import { AuthenticateUseCase } from '@/use-cases/users/authenticate';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeUser } from '../factories/makeUser';
import { ulid } from 'serverless-crypto-utils/id-generation';

let usersDaf: InMemoryUserDAF;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersDaf = new InMemoryUserDAF();
    sut = new AuthenticateUseCase(usersDaf);
  });

  it('should be able to authenticate', async () => {
    await usersDaf.create({
      id: ulid(),
      email: 'janedoe@example.com',
      passwordHash: await hashPassword('123@Mudar'),
      role: 'user',
    });

    const { user } = await sut.execute({
      email: 'janedoe@example.com',
      password: '123@Mudar',
    });

    expect(user.id).toBeDefined();
  });

  it('should not be able authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123@Mudar',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = await makeUser({
      email: 'janedoe@example.com',
      password: '123@Mudar',
    });

    await usersDaf.create(user);

    await expect(() =>
      sut.execute({
        email: 'janedoe@example.com',
        password: '123@Mudar4',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
