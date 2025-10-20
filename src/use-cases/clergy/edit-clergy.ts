import type { Clergy } from '@/entities/clergy';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { ClergyDAF } from '@/services/database/clergy-daf';
import { ClergyPositionAlreadyExistsError } from '../errors/clergy-position-already-exists-error';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { makeSlug } from '../factories/make-slug';
import { NameAlreadyExistsError } from '../errors/name-already-exists-error';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface EditClergyUseCaseRequest {
  clergyId: string;
  title: string;
  name: string;
  position:
    | 'supreme_pontiff'
    | 'diocesan_bishop'
    | 'parish_priest'
    | 'permanent_deacon';
  photoId: string;
}

interface EditClergyUseCaseResponse {
  clergy: Clergy;
}

export class EditClergyUseCase {
  constructor(
    private clergyDaf: ClergyDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    clergyId,
    title,
    name,
    position,
    photoId,
  }: EditClergyUseCaseRequest): Promise<EditClergyUseCaseResponse> {
    const clergy = await this.clergyDaf.findById(clergyId);

    if (!clergy) {
      throw new ResourceNotFoundError();
    }

    if (
      clergy.position !== position &&
      ['supreme_pontiff', 'diocesan_bishop', 'parish_priest'].includes(position)
    ) {
      const clergyWithSamePosition =
        await this.clergyDaf.findByPosition(position);

      if (clergyWithSamePosition) {
        throw new ClergyPositionAlreadyExistsError();
      }
    }

    if (clergy.name !== name && position === 'permanent_deacon') {
      const clergyWithSameName = await this.clergyDaf.findByName(name);

      if (clergyWithSameName) {
        throw new NameAlreadyExistsError();
      }
    }

    if (clergy.photoId !== photoId) {
      const attachment = await this.attachmentsDaf.findById(photoId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }

      await Promise.all([
        this.attachmentsDaf.save(clergy.photoId, { status: 'deleted' }),
        this.attachmentsDaf.save(attachment.id, { status: 'attached' }),
      ]);
    }

    clergy.title = title;
    clergy.name = name;
    clergy.slug = makeSlug(title.concat(' ', name));
    clergy.position = position;
    clergy.photoId = photoId;
    clergy.updatedAt = new Date().toISOString();

    await this.clergyDaf.save(clergy);

    return { clergy };
  }
}
