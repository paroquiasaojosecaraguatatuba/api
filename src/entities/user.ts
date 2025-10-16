export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user' | 'viewer';

  constructor(params: {
    id: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }) {
    this.id = params.id;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.role = params.role;
  }
}
