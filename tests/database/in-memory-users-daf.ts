import type { User } from '@/entities/user';
import type { UsersDAF } from '@/services/database/users-daf';

export class InMemoryUserDAF implements UsersDAF {
  public users: User[] = [];

  async findByEmail(email: string) {
    const user = this.users.find((u) => u.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create({
    id,
    email,
    passwordHash,
    role,
  }: {
    id: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }) {
    const newUser = {
      id,
      email,
      passwordHash,
      role,
    };

    this.users.push(newUser);

    return newUser;
  }
}
