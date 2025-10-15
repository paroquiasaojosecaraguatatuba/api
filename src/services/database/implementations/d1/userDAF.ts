import { ulid } from "serverless-crypto-utils/id-generation";
import { IUserDAF } from "../../contracts/IUserDAF";
import { DatabaseError } from "@/errors/DatabaseError";

export const userDAF: IUserDAF = {
  exists: async ({ email }, c: DomainContext): Promise<boolean> => {
    const existingUser = await c.env.DB
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: string; }>();

    return Boolean(existingUser);
  },

  findByEmail: async (email: string, c: DomainContext) => {
    const user = await c.env.DB
      .prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?')
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
      role: user.role
    };
  },

  create: async ({email, passwordHash, role}, c: DomainContext) => {
    const userId = ulid();
    
    const result = await c.env.DB
      .prepare(`
        INSERT INTO users (id, email, password_hash, role) 
        VALUES (?, ?, ?, ?) 
        RETURNING id, email, password_hash, role
      `)
      .bind(userId, email, passwordHash, role)
      .first<{
        id: string;
        email: string;
        password_hash: string;
        role: string;
      }>();

    if (!result) {
      throw new DatabaseError('Failed to create user', { values: {email, passwordHash, role}});
    }

    return {
      id: result.id,
      email: result.email,
      passwordHash: result.password_hash,
      role: result.role
    };
  }
}