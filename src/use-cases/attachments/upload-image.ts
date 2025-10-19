import type { ImagesDAM } from '@/services/dam/images-dam';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import { ulid, uuidV4 } from 'serverless-crypto-utils/id-generation';

interface UploadImageUseCaseRequest {
  file: File;
  userId: string;
  storage: 'r2';
}

interface UploadImageUseCaseResponse {
  attachmentId: string;
}

export class UploadImageUseCase {
  constructor(
    private attachmentsDaf: AttachmentsDAF,
    private imagesDam: ImagesDAM,
  ) {}

  async execute({
    file,
    storage,
    userId,
  }: UploadImageUseCaseRequest): Promise<UploadImageUseCaseResponse> {
    const attachmentId = ulid();

    const mimeToExtension: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };

    const extension = mimeToExtension[file.type] || 'jpg';
    const filename = `${uuidV4()}.${extension}`;

    await this.imagesDam.upload({
      file,
      filename,
    });

    await this.attachmentsDaf.create({
      id: attachmentId,
      filename,
      mimeType: file.type,
      userId,
      status: 'pending',
      storage,
      uploadedAt: new Date().toISOString(),
    });

    return {
      attachmentId,
    };
  }
}
