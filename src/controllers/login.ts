import { useLoginSchema } from "@/schemas/useLoginSchema";
import { getAppContext } from "@/utils/getAppContext";
import { verifyPassword, createAccessToken } from "serverless-crypto-utils";

export const login: ControllerFunction = async (c) => {
  const {daf, inputs, t} = getAppContext(c)

  const validationSchema = useLoginSchema(t)

  const {email, password} = validationSchema.parse(inputs)

  const user = await daf.user.findByEmail(email, c)

  if (!user) {
    return c.json({ message: t('invalid-email-or-password')}, 401)
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    return c.json({ message: t('invalid-email-or-password') }, 401)
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