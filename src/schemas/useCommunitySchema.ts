import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useCommunitySchema = (t: TranslatorFn) => {
  const userSchema = z.object({
    name: z
      .string()
      .min(1, t('required-field'))
      .max(255, t('error-max-length', { max: 100 })),
    type: z.enum(['chapel', 'parish_church'], {
      message: t('invalid-community-type'),
    }),
    address: z
      .string()
      .min(1, t('required-field'))
      .max(500, t('error-max-length', { max: 500 })),
    coverId: z.ulid(t('invalid-file-id')),
  });

  return userSchema;
};
