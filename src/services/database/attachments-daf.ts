import type { Attachment } from '@/entities/attachment';

export interface AttachmentsDAF {
  findById: (id: string) => Promise<Attachment | null>;
  create: (attachment: {
    id: string;
    filename: string;
    mimeType: string;
    storage: 'r2';
    status: 'pending' | 'attached' | 'deleted';
    uploadedAt: string;
    userId: string;
  }) => Promise<void>;
  save: (
    id: string,
    data: {
      status: 'pending' | 'attached' | 'deleted';
    },
  ) => Promise<void>;
}
