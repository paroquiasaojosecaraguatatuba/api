import { verifyPassword } from "serverless-crypto-utils";

type Input = {
  email: string;
  password: string;
}

export const login: ControllerFunction = async (c) => {
  const {email, password} = c.env.data as Input;

  const user = await c.env.DB
    .prepare('SELECT password_hash FROM users WHERE email = ?')
    .bind(email)
    .first<{
      password_hash: string
    }>()

  if (!user) {
    return c.json({ message: 'Email ou senha inválidos.' }, 401)
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return c.json({ message: 'Email ou senha inválidos.' }, 401)
  }

  return c.json({ message: 'Usuário autenticado com sucesso!' });
}