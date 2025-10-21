import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useSlugSchema = (t: TranslatorFn) => {
  const schema = z.object({
    slug: z
      .string()
      .min(1, t('error-slug-required'))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, t('error-slug-invalid')),
  });

  return schema;
};
