import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const usePastoralSchema = (t: TranslatorFn) => {
  const userSchema = z.object({
    name: z
      .string()
      .min(1, t('required-field'))
      .max(255, t('error-max-length', { max: 100 })),
    description: z
      .string()
      .min(1, t('required-field'))
      .max(500, t('error-max-length', { max: 500 })),
    responsibleName: z
      .string()
      .min(1, t('required-field'))
      .max(255, t('error-max-length', { max: 100 })),
    contactPhone: z
      .string()
      .min(1, t('required-field'))
      .max(20, t('error-max-length', { max: 100 })),
    coverId: z.ulid(t('invalid-file-id')),
  });

  return userSchema;
};
