import type { TranslatorFn } from '@/dictionaries';
import * as z from 'zod';

export const useBlogDraftSchema = (t: TranslatorFn) => {
  const schema = z
    .object({
      title: z
        .string()
        .min(1, t('required-field'))
        .max(255, t('error-max-length', { max: 255 })),
      content: z.string().min(1, t('required-field')),
      excerpt: z
        .string()
        .max(200, t('error-max-length', { max: 200 }))
        .optional(),
      eventDate: z.iso
        .datetime({ message: t('invalid-datetime') })
        .refine(
          (date) => {
            const eventDate = new Date(date);
            const now = new Date();
            // ✅ Não pode ser menos de 1 hora no futuro
            const minEventTime = new Date(now.getTime() + 60 * 60 * 1000);
            return eventDate >= minEventTime;
          },
          { message: t('error-event-date-must-be-future') },
        )
        .refine(
          (date) => {
            const eventDate = new Date(date);
            const maxEventTime = new Date();
            // ✅ Não pode ser mais de 3 meses no futuro
            maxEventTime.setMonth(maxEventTime.getMonth() + 3);
            return eventDate <= maxEventTime;
          },
          { message: t('error-event-date-too-far-future') },
        )
        .optional(),
      scheduledPublishAt: z.iso
        .datetime({ message: t('invalid-datetime') })
        .refine(
          (date) => {
            const publishDate = new Date(date);
            const now = new Date();
            // ✅ Não pode ser menos de 5 minutos no futuro
            const minPublishTime = new Date(now.getTime() + 5 * 60 * 1000);
            return publishDate >= minPublishTime;
          },
          { message: t('error-scheduled-publish-too-soon') },
        )
        .refine(
          (date) => {
            const publishDate = new Date(date);
            const maxPublishTime = new Date();
            // ✅ Não pode ser mais de 3 meses no futuro
            maxPublishTime.setMonth(maxPublishTime.getMonth() + 3);
            return publishDate <= maxPublishTime;
          },
          { message: t('error-scheduled-publish-too-far') },
        )
        .optional(),
      scheduledUnpublishAt: z.iso
        .datetime({ message: t('invalid-datetime') })
        .refine(
          (date) => {
            const unpublishDate = new Date(date);
            const now = new Date();
            // ✅ Despublicação deve ser no futuro
            return unpublishDate > now;
          },
          { message: t('error-scheduled-unpublish-in-past') },
        )
        .optional(),
      coverId: z.string().min(1, t('required-field')),
      categorySlug: z.string().min(1, t('required-field')),
    })
    // ✅ Validações cruzadas entre campos
    .refine(
      (data) => {
        // Se tem agendamento de publicação E despublicação
        if (data.scheduledPublishAt && data.scheduledUnpublishAt) {
          const publishDate = new Date(data.scheduledPublishAt);
          const unpublishDate = new Date(data.scheduledUnpublishAt);
          // ✅ Despublicação deve ser após publicação (pelo menos 1 hora)
          const minUnpublishTime = new Date(
            publishDate.getTime() + 60 * 60 * 1000,
          );
          return unpublishDate >= minUnpublishTime;
        }
        return true;
      },
      {
        message: t('error-unpublish-must-be-after-publish'),
        path: ['scheduledUnpublishAt'],
      },
    )
    .refine(
      (data) => {
        // Se tem evento E agendamento de publicação
        if (data.eventDate && data.scheduledPublishAt) {
          const eventDate = new Date(data.eventDate);
          const publishDate = new Date(data.scheduledPublishAt);
          // ✅ Post de evento deve ser publicado ANTES do evento
          return publishDate < eventDate;
        }
        return true;
      },
      {
        message: t('error-event-post-must-publish-before-event'),
        path: ['scheduledPublishAt'],
      },
    )
    .refine(
      (data) => {
        // Se tem evento E agendamento de despublicação
        if (data.eventDate && data.scheduledUnpublishAt) {
          const eventDate = new Date(data.eventDate);
          const unpublishDate = new Date(data.scheduledUnpublishAt);
          // ✅ Post de evento pode ser despublicado após o evento (opcional)
          // Mas se for antes, deve ser pelo menos no dia do evento
          if (unpublishDate < eventDate) {
            // Se despublicar antes do evento, deve ser no mesmo dia
            return unpublishDate.toDateString() === eventDate.toDateString();
          }
          return true;
        }
        return true;
      },
      {
        message: t('error-event-post-unpublish-timing'),
        path: ['scheduledUnpublishAt'],
      },
    );

  return schema;
};
