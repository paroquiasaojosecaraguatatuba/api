import type { AttachmentsDAF } from '../attachments-daf';

export class D1AttachmentsDAF implements AttachmentsDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string) {
    const attachment = await this.d1
      .prepare(
        'SELECT id, filename, mime_type, status, uploaded_by, uploaded_at, storage_provider FROM attachments WHERE id = ?',
      )
      .bind(id)
      .first<{
        id: string;
        filename: string;
        mime_type: string;
        status: 'pending' | 'attached';
        uploaded_by: string;
        uploaded_at: string;
        storage_provider: 'r2';
      }>();

    if (!attachment) {
      return null;
    }

    return {
      id: attachment.id,
      filename: attachment.filename,
      mimeType: attachment.mime_type,
      userId: attachment.uploaded_by,
      status: attachment.status,
      uploadedAt: attachment.uploaded_at,
      storageProvider: attachment.storage_provider,
    };
  }

  async create({
    id,
    filename,
    mimeType,
    storageProvider,
    status,
    uploadedAt,
    userId,
  }: {
    id: string;
    filename: string;
    mimeType: string;
    storageProvider: 'r2';
    status: 'pending' | 'attached' | 'deleted';
    uploadedAt: string;
    userId: string;
  }) {
    await this.d1
      .prepare(
        'INSERT INTO attachments (id, filename, mime_type, uploaded_by, storage_provider, uploaded_at, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(id, filename, mimeType, userId, storageProvider, uploadedAt, status)
      .run();
  }

  async save(id: string, data: { status: 'pending' | 'attached' | 'deleted' }) {
    await this.d1
      .prepare('UPDATE attachments SET status = ? WHERE id = ?')
      .bind(data.status, id)
      .run();
  }
}
