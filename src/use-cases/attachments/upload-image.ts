import type { ImagesDAM } from '@/services/dam/images-dam';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import { ulid, uuidV4 } from 'serverless-crypto-utils/id-generation';

interface UploadImageUseCaseRequest {
  file: File;
  userId: string;
}

interface UploadImageUseCaseResponse {
  file: {
    id: string;
  };
}

export class UploadImageUseCase {
  constructor(
    private attachmentsDaf: AttachmentsDAF,
    private imagesDam: ImagesDAM,
  ) {}

  async execute({
    file,
    userId,
  }: UploadImageUseCaseRequest): Promise<UploadImageUseCaseResponse> {
    const id = ulid();

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
      id,
      filename,
      mimeType: file.type,
      userId,
    });

    return {
      file: { id },
    };
  }
}
