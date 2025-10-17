import { UsersDAF } from '@/services/database/users-daf';
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
  constructor(private usersDaf: UsersDAF) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersDaf.findByEmail(email);

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
