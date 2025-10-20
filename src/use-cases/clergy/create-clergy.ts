import type { Clergy } from '@/entities/clergy';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { ClergyDAF } from '@/services/database/clergy-daf';
import { ClergyPositionAlreadyExistsError } from '../errors/clergy-position-already-exists-error';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { ulid } from 'serverless-crypto-utils/id-generation';
import { makeSlug } from '../factories/make-slug';
import { NameAlreadyExistsError } from '../errors/name-already-exists-error';

interface CreateClergyUseCaseRequest {
  title: string;
  name: string;
  position:
    | 'supreme_pontiff'
    | 'diocesan_bishop'
    | 'parish_priest'
    | 'permanent_deacon';
  photoId: string;
}

interface CreateClergyUseCaseResponse {
  clergy: Clergy;
}

export class CreateClergyUseCase {
  constructor(
    private clergyDaf: ClergyDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    title,
    name,
    position,
    photoId,
  }: CreateClergyUseCaseRequest): Promise<CreateClergyUseCaseResponse> {
    if (
      ['supreme_pontiff', 'diocesan_bishop', 'parish_priest'].includes(position)
    ) {
      const clergyWithSamePosition =
        await this.clergyDaf.findByPosition(position);

      if (clergyWithSamePosition) {
        throw new ClergyPositionAlreadyExistsError();
      }
    }

    if (position === 'permanent_deacon') {
      const clergyWithSameName = await this.clergyDaf.findByName(name);

      if (clergyWithSameName) {
        throw new NameAlreadyExistsError();
      }
    }

    const attachment = await this.attachmentsDaf.findById(photoId);

    if (!attachment) {
      throw new AttachmentNotFoundError();
    }

    await this.attachmentsDaf.save(attachment.id, { status: 'attached' });

    const clergy = {
      id: ulid(),
      title,
      name,
      slug: makeSlug(title.concat(' ', name)),
      position,
      photoId: attachment.id,
      createdAt: new Date().toISOString(),
    };

    await this.clergyDaf.create(clergy);

    return { clergy };
  }
}
