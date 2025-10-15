import { useUserSchema } from "@/schemas/useUserSchema";
import { getAppContext } from "@/utils/getAppContext";
import { hashPassword } from "serverless-crypto-utils";

export const createUser: ControllerFunction = async (c) => {
  const {daf, t, inputs} = getAppContext(c)

  const userSchema = useUserSchema(t)

  const {email, password, role} = userSchema.parse(inputs)

  const existingUser = await daf.user.exists({ email }, c);

  if (existingUser) {
    return c.json({ message: t('error-email-already-exists') }, 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await daf.user.create({
    email,
    passwordHash: hashedPassword,
    role
  }, c)

  return c.json({ user });
}