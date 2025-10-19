import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useConfirmCodeSchema = (t: TranslatorFn) => {
  const schema = z.object({
    email: z.email(t('invalid-email')).min(1, t('required-field')),
    code: z.string().length(5, t('invalid-code')).min(1, t('required-field')),
  });

  return schema;
};
