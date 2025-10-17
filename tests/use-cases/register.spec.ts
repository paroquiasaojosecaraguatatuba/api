import { describe, beforeEach, it, expect } from 'vitest';
import { RegisterUseCase } from '@/use-cases/register';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';
import { verifyPassword } from 'serverless-crypto-utils';
import { InMemoryUserDAF } from '../database/in-memory-users-daf';

let usersDaf: InMemoryUserDAF;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersDaf = new InMemoryUserDAF();
    sut = new RegisterUseCase(usersDaf);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      email: 'janedoe@example.com',
      password: '123@Mudar',
      role: 'user',
    });

    expect(user.id).toBeDefined();
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'janedoe@example.com',
      password: '123@Mudar',
      role: 'user',
    });

    const isPasswordCorrectlyHashed = await verifyPassword(
      '123@Mudar',
      user.passwordHash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'janedoe@example.com';

    await sut.execute({
      email,
      password: '456@Mudar',
      role: 'user',
    });

    await expect(() =>
      sut.execute({
        email,
        password: '456@Mudar',
        role: 'user',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
