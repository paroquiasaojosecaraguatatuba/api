import type { User } from '@/entities/user';

export interface UsersDAF {
  findByEmail(email: string): Promise<User | null>;
  create(user: {
    id: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }): Promise<User>;
}
