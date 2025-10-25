import { faker } from '@faker-js/faker';
import type { Attachment } from '@/entities/attachment';
import { makeId } from '@/use-cases/factories/make-id';

interface MakeAttachmentParams extends Partial<Omit<Attachment, 'userId'>> {
  userId: string;
}

export function makeAttachment({
  userId,
  ...override
}: MakeAttachmentParams): Attachment {
  return {
    id: makeId(),
    userId,
    filename: `${faker.string.uuid()}.jpg`,
    mimeType: 'image/jpeg',
    status: 'pending' as const,
    uploadedAt: new Date().toISOString(),
    storageProvider: 'r2',
    ...override,
  };
}
