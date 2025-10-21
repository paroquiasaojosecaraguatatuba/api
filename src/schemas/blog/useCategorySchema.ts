import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useCategorySchema = (t: TranslatorFn) => {
  const schema = z.object({
    name: z
      .string()
      .min(1, t('required-field'))
      .max(50, t('error-max-length', { max: 50 })),
  });

  return schema;
};
