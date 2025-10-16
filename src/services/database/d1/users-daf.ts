import { ulid } from 'serverless-crypto-utils/id-generation';
import { DatabaseError } from '@/errors/DatabaseError';
import { UsersDAF } from '../users-daf';

export class D1UserDAF implements UsersDAF {
  private client: D1Database;

  constructor(client: D1Database) {
    this.client = client;
  }

  async findByEmail(email: string): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  } | null> {
    const user = await this.client
      .prepare(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
      )
      .bind(email)
      .first<{
        id: string;
        email: string;
        password_hash: string;
        role: string;
      }>();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.password_hash,
      role: user.role,
    };
  }

  async create({
    email,
    passwordHash,
    role,
  }: {
    email: string;
    passwordHash: string;
    role: 'admin' | 'user' | 'viewer';
  }): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    role: string;
  }> {
    const userId = ulid();

    const result = await this.client
      .prepare(
        `
        INSERT INTO users (id, email, password_hash, role) 
        VALUES (?, ?, ?, ?) 
        RETURNING id, email, password_hash, role
      `,
      )
      .bind(userId, email, passwordHash, role)
      .first<{
        id: string;
        email: string;
        password_hash: string;
        role: string;
      }>();

    if (!result) {
      throw new DatabaseError('Failed to create user', {
        values: { email, passwordHash, role },
      });
    }

    return {
      id: result.id,
      email: result.email,
      passwordHash: result.password_hash,
      role: result.role,
    };
  }
}
