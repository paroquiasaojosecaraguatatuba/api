import type { User } from '@/entities/user';

export interface UsersDAF {
  findByEmail(email: string): Promise<User | null>;
  create(user: {
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }): Promise<User>;
}
