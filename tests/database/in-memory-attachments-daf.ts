import type { Attachment } from '@/entities/attachment';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';

export class InMemoryAttachmentsDAF implements AttachmentsDAF {
  public attachments: Attachment[] = [];

  async findById(id: string): Promise<Attachment | null> {
    const attachment = this.attachments.find((a) => a.id === id);

    if (!attachment) {
      return null;
    }

    return attachment;
  }

  async create(attachment: {
    id: string;
    filename: string;
    mimeType: string;
    userId: string;
    storageProvider: 'r2';
    status: 'pending' | 'attached' | 'deleted';
    uploadedAt: string;
  }): Promise<void> {
    this.attachments.push(attachment);
  }

  async save(
    id: string,
    data: { status: 'pending' | 'attached' | 'deleted' },
  ): Promise<void> {
    const index = this.attachments.findIndex((a) => a.id === id);

    if (index >= 0) {
      this.attachments[index] = {
        ...this.attachments[index],
        ...data,
      };
    }
  }
}
