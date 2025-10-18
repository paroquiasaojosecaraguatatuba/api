import { R2ImagesDAM } from '@/services/dam/r2/r2-images-dam';
import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { UploadImageUseCase } from '../attachments/upload-image';

export function makeUploadImageUseCase(c: DomainContext) {
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const imagesDam = new R2ImagesDAM(c.env.R2_BUCKET);
  const uploadImageUseCase = new UploadImageUseCase(attachmentsDaf, imagesDam);

  return uploadImageUseCase;
}
