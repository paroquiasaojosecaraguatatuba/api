import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export function useMassScheduleExceptionSchema(t: TranslatorFn) {
  const schema = z.object({
    exceptionDate: z.string().refine(
      (date) => {
        if (!date) return true;
        return !Number.isNaN(Date.parse(date));
      },
      { message: t('invalid-date') },
    ),
    startTime: z.string().nonempty(t('error-start-time-required')),
    reason: z.string().nonempty(t('error-reason-required')),
  });

  return schema;
}
