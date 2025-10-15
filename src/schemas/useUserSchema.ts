import { TranslatorFn } from "@/dictionaries";
import * as z from "zod";

export const useUserSchema = (t: TranslatorFn) => {
  const userSchema = z.object({
    email: z
      .email(t('invalid-email'))
      .min(1, t('required-field')),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: t('invalid-password')
      })
      .min(1, t('required-field')),
    role: z.enum(['admin', 'user', 'viewer'], {
      message: t('invalid-role')
    })
  });

  return userSchema;
}
