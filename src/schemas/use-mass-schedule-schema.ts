import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export function useMassScheduleSchema(t: TranslatorFn) {
  const schema = z.object({
    communityId: z.ulid(t('invalid-community-id')),
    title: z
      .string()
      .max(255, t('error-max-length', { max: 255 }))
      .optional(),
    type: z.enum<('regular' | 'devotional' | 'solemnity')[]>(
      ['regular', 'devotional', 'solemnity'],
      t('invalid-mass-schedule-type'),
    ),
    description: z
      .string()
      .max(255, t('error-max-length', { max: 255 }))
      .optional(),
    isPrecept: z.boolean(),
    recurrenceType: z.enum<('weekly' | 'monthly' | 'yearly')[]>(
      ['weekly', 'monthly', 'yearly'],
      t('invalid-recurrence-type'),
    ),
    dayOfWeek: z
      .number()
      .min(0, t('error-day-of-week-range', { min: 0, max: 6 }))
      .max(6, t('error-day-of-week-range', { min: 0, max: 6 }))
      .optional(),
    dayOfMonth: z
      .number()
      .min(1, t('error-day-of-month-range', { min: 1, max: 31 }))
      .max(31, t('error-day-of-month-range', { min: 1, max: 31 }))
      .optional(),
    weekOfMonth: z
      .number()
      .min(1, t('error-week-of-month-range', { min: 1, max: 5 }))
      .max(5, t('error-week-of-month-range', { min: 1, max: 5 }))
      .optional(),
    monthOfYear: z
      .number()
      .min(1, t('error-month-of-year-range', { min: 1, max: 12 }))
      .max(12, t('error-month-of-year-range', { min: 1, max: 12 }))
      .optional(),
    startDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true;
          return !Number.isNaN(Date.parse(date));
        },
        { message: t('invalid-start-date') },
      )
      .optional(),
    endDate: z
      .string()
      .refine(
        (date) => {
          if (!date) return true;
          return !Number.isNaN(Date.parse(date));
        },
        { message: t('invalid-end-date') },
      )
      .optional(),
    times: z
      .array(
        z.string().refine((time) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(time), {
          message: t('invalid-time-format'),
        }),
      )
      .min(1, t('error-at-least-one-time-required')),
  });

  return schema;
}
