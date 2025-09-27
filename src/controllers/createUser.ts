import { hashPassword, ulid } from "serverless-crypto-utils";

type Input = {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'viewer';
}

export const createUser: ControllerFunction = async (c) => {
  const {email, password, role} = c.env.data as Input;

  const hashedPassword = await hashPassword(password);

  await c.env.DB
    .prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .bind(ulid(), email, hashedPassword, role)
    .run();

  return c.json({ message: 'Usuário criado com sucesso!' });
}