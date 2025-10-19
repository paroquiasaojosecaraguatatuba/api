import type { Pastoral } from '@/entities/pastoral';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { PastoralsDAF } from '@/services/database/pastorals-daf';
import { ResourceAlreadyExistsError } from '../errors/resource-already-exists-error';
import { AttachmentNotFoundError } from '../errors/attachment-not-found-error';
import { makeSlug } from '../factories/make-slug';
import { ulid } from 'serverless-crypto-utils/id-generation';

interface CreatePastoralUseCaseRequest {
  name: string;
  description: string;
  responsibleName: string;
  contactPhone: string;
  coverId: string;
}

interface CreatePastoralUseCaseResponse {
  pastoral: Pastoral;
}

export class CreatePastoralUseCase {
  constructor(
    private pastoralsDaf: PastoralsDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    name,
    description,
    responsibleName,
    contactPhone,
    coverId,
  }: CreatePastoralUseCaseRequest): Promise<CreatePastoralUseCaseResponse> {
    const pastoralWithSameName = await this.pastoralsDaf.findByName(name);

    if (pastoralWithSameName) {
      throw new ResourceAlreadyExistsError();
    }

    const attachment = await this.attachmentsDaf.findById(coverId);

    if (!attachment) {
      throw new AttachmentNotFoundError();
    }

    await this.attachmentsDaf.save(attachment.id, { status: 'attached' });

    const pastoral = {
      id: ulid(),
      name,
      slug: makeSlug(name),
      description,
      responsibleName,
      contactPhone,
      coverId,
      createdAt: new Date().toISOString(),
      active: true,
    };

    await this.pastoralsDaf.create(pastoral);

    return { pastoral };
  }
}
