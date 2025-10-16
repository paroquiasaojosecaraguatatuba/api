import { UserDAF } from '@/services/database/users-daf';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { hashPassword } from 'serverless-crypto-utils/password-hashing';

interface RegisterUseCaseRequest {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'viewer';
}

interface RegisterUseCaseResponse {
  user: {
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  };
}

export class RegisterUseCase {
  constructor(private userDaf: UserDAF) {}

  async execute({
    email,
    password,
    role,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.userDaf.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hashPassword(password);

    const user = await this.userDaf.create({
      email,
      passwordHash,
      role,
    });

    return { user };
  }
}
