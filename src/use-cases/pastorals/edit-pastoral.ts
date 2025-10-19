import type { Pastoral } from '@/entities/pastoral';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { PastoralsDAF } from '@/services/database/pastorals-daf';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { makeSlug } from '../factories/make-slug';
import { ulid } from 'serverless-crypto-utils/id-generation';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface EditPastoralUseCaseRequest {
  id: string;
  name: string;
  description: string;
  responsibleName: string;
  contactPhone: string;
  coverId: string;
}

interface EditPastoralUseCaseResponse {
  pastoral: Pastoral;
}

export class EditPastoralUseCase {
  constructor(
    private pastoralsDaf: PastoralsDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    id,
    name,
    description,
    responsibleName,
    contactPhone,
    coverId,
  }: EditPastoralUseCaseRequest): Promise<EditPastoralUseCaseResponse> {
    const pastoral = await this.pastoralsDaf.findById(id);

    if (!pastoral) {
      throw new ResourceNotFoundError();
    }

    if (pastoral.name !== name) {
      const pastoralWithSameName = await this.pastoralsDaf.findByName(name);

      if (pastoralWithSameName) {
        throw new ResourceAlreadyExistsError();
      }
    }

    if (pastoral.coverId !== coverId) {
      const attachment = await this.attachmentsDaf.findById(coverId);

      if (!attachment) {
        throw new AttachmentNotFoundError();
      }

      await Promise.all([
        this.attachmentsDaf.save(pastoral.coverId, { status: 'deleted' }),
        this.attachmentsDaf.save(attachment.id, { status: 'attached' }),
      ]);
    }

    pastoral.name = name;
    pastoral.slug = makeSlug(name);
    pastoral.description = description;
    pastoral.responsibleName = responsibleName;
    pastoral.contactPhone = contactPhone;
    pastoral.coverId = coverId;
    pastoral.updatedAt = new Date().toISOString();

    await this.pastoralsDaf.save(pastoral);

    return { pastoral };
  }
}
