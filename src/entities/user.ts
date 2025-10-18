export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'viewer';
};
