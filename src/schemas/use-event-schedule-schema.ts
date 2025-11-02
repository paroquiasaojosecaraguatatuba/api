import type { TranslatorFn } from '@/dictionaries';
import z from 'zod';

export function useEventScheduleSchema(t: TranslatorFn) {
  const schema = z.object({
    communityId: z.ulid({
      message: t('invalid-community-id'),
    }),
    title: z
      .string(t('required-field'))
      .min(3, t('error-min-length', { min: 3 }))
      .max(255, t('error-max-length', { max: 255 })),
    type: z.enum<
      (
        | 'mass'
        | 'pilgrimage'
        | 'service'
        | 'formation'
        | 'feast'
        | 'anniversary'
        | 'conference'
        | 'meeting'
        | 'celebration'
        | 'retreat'
        | 'liturgical_event'
        | 'ordination'
        | 'community_event'
        | 'other'
      )[]
    >(
      [
        'anniversary',
        'celebration',
        'community_event',
        'conference',
        'feast',
        'formation',
        'liturgical_event',
        'mass',
        'meeting',
        'ordination',
        'other',
        'pilgrimage',
      ],
      t('invalid-event-schedule-type'),
    ),
    eventDate: z.string(t('required-field')).refine(
      (date) => {
        return !Number.isNaN(Date.parse(date));
      },
      { message: t('invalid-date') },
    ),
    startTime: z.string().refine(
      (time) => {
        if (!time) return true;
        const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
      },
      { message: t('invalid-time-format') },
    ),
    endTime: z
      .string()
      .optional()
      .refine(
        (time) => {
          if (!time) return true;
          const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
          return timeRegex.test(time);
        },
        { message: t('invalid-time-format') },
      ),
    customLocation: z
      .string()
      .max(255, t('error-max-length', { max: 255 }))
      .optional(),
    orientations: z
      .string()
      .max(500, t('error-max-length', { max: 500 }))
      .optional(),
  });

  return schema;
}
