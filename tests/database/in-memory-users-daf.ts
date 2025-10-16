import { User } from '@/entities/user';
import { UsersDAF } from '@/services/database/users-daf';

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
    email,
    passwordHash,
    role,
  }: {
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }) {
    const newUser = new User({
      id: (this.users.length + 1).toString(),
      email,
      passwordHash,
      role,
    });

    this.users.push(newUser);

    return newUser;
  }
}
