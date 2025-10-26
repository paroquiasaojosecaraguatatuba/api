import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';
import { usePaginationSchema } from '../use-pagination-schema';

export const useBlogPostsPaginationSchema = (t: TranslatorFn) => {
  const paginationSchema = usePaginationSchema(t);

  const schema = z
    .object({
      categorySlug: z.string().min(1, t('required-field')),
    })
    .extend(paginationSchema.shape);

  return schema;
};
