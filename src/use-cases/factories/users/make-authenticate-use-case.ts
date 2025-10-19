import { D1UserDAF } from '@/services/database/d1/d1-users-daf';
import { AuthenticateUseCase } from '@/use-cases/users/authenticate';

export function makeAuthenticateUseCase(c: DomainContext) {
  const userDaf = new D1UserDAF(c.env.DB);
  const authenticateUseCase = new AuthenticateUseCase(userDaf);

  return authenticateUseCase;
}
