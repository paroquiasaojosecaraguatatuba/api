import { AttachmentsDAF } from '../attachments-daf';

export class D1AttachmentsDAF implements AttachmentsDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async create({
    id,
    filename,
    mimeType,
    userId,
  }: {
    id: string;
    filename: string;
    mimeType: string;
    userId: string;
  }) {
    await this.d1
      .prepare(
        'INSERT INTO attachments (id, filename, mime_type, user_id) VALUES (?, ?, ?, ?)',
      )
      .bind(id, filename, mimeType, userId)
      .run();
  }
}
