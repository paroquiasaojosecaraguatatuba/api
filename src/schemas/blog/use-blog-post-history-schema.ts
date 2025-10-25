import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useBlogPostHistorySchema = (t: TranslatorFn) => {
  const schema = z.object({
    action: z.enum<('published' | 'unpublished' | 'edited')[]>(
      ['published', 'unpublished', 'edited'],
      t('invalid-action'),
    ),
    changesSummary: z
      .string()
      .max(500, t('error-max-length', { max: 500 }))
      .optional(),
  });

  return schema;
};
