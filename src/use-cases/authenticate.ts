import { UserDAF } from '@/services/database/users-daf';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { verifyPassword } from 'serverless-crypto-utils/password-hashing';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  };
}

export class AuthenticateUseCase {
  constructor(private userDaf: UserDAF) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userDaf.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
