import { faker } from '@faker-js/faker';
import type { Attachment } from '@/entities/attachment';

interface MakeAttachmentParams {
  id: string;
  userId: string;
  override?: Partial<Omit<Attachment, 'userId' & 'id'>>;
}

export function makeAttachment({
  id,
  userId,
  override,
}: MakeAttachmentParams): Attachment {
  return {
    id,
    userId,
    filename: `${faker.string.uuid()}.jpg`,
    mimeType: 'image/jpeg',
    status: 'pending' as const,
    uploadedAt: new Date().toISOString(),
    storageProvider: 'r2',
    ...override,
  };
}
