import { InMemoryUserDAF } from '../database/in-memory-users-daf';
import { RegisterUseCase } from '@/use-cases/register';

export function makeRegisterUseCase() {
  const userDaf = new InMemoryUserDAF();
  const registerUseCase = new RegisterUseCase(userDaf);

  return registerUseCase;
}
