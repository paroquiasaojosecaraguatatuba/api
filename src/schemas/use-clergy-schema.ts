import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useClergySchema = (t: TranslatorFn) => {
  const clergySchema = z.object({
    title: z
      .string()
      .min(1, t('required-field'))
      .max(100, t('error-max-length', { max: 100 })),
    name: z
      .string()
      .min(1, t('required-field'))
      .max(255, t('error-max-length', { max: 100 })),
    position: z.enum(
      [
        'supreme_pontiff',
        'diocesan_bishop',
        'parish_priest',
        'permanent_deacon',
      ],
      t('invalid-clergy-position'),
    ),
    photoId: z.ulid(t('invalid-file-id')),
  });

  return clergySchema;
};
