import { D1UserDAF } from '@/services/database/implementations/d1/userDAF';
import { RegisterUseCase } from '../register';

export function makeRegisterUseCase(c: DomainContext) {
  const userDaf = new D1UserDAF(c.env.DB);
  const registerUseCase = new RegisterUseCase(userDaf);

  return registerUseCase;
}
