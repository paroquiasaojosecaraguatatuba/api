import {  verifyPassword, createAccessToken } from "serverless-crypto-utils";

type Input = {
  email: string;
  password: string;
}

export const login: ControllerFunction = async (c) => {
  const {email, password} = c.env.data as Input;

  const user = await c.env.DB
    .prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?')
    .bind(email)
    .first<{
      id: string,
      email: string,
      password_hash: string
      role: string
    }>()

  if (!user) {
    return c.json({ message: 'Email ou senha inválidos.' }, 401)
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return c.json({ message: 'Email ou senha inválidos.' }, 401)
  }

  const accessToken = await createAccessToken({
    encryptionSecret: c.env.ENCRYPTION_SECRET,
    signingSecret: c.env.SIGNING_SECRET,
    payload: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    },
    expiresInSeconds: 3600 // 1 hora
  }) 

  return c.json({ accessToken });
}