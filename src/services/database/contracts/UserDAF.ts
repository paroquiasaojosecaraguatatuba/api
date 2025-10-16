export interface UserDAF {
  findByEmail(email: string): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  } | null>;
  create(user: {
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  }>;
}
