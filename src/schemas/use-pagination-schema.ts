import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const usePaginationSchema = (t: TranslatorFn) => {
  const schema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  return schema;
};
