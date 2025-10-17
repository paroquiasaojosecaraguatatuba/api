import { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useImageSchema = (t: TranslatorFn) => {
  const imageSchema = z.object({
    file: z
      .any()
      .refine((file) => file instanceof File, {
        message: t('invalid-file-type'),
      })
      .refine((file) => file?.size <= 5 * 1024 * 1024, {
        message: t('file-too-large', { maxSize: '5MB' }), // 5MB limit
      })
      .refine((file) => ['image/jpeg', 'image/png'].includes(file?.type), {
        message: t('unsupported-file-format', {
          formats: 'JPEG, PNG',
        }),
      }),
  });

  return imageSchema;
};
