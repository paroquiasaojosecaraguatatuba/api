import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { PastoralsDAF } from '@/services/database/pastorals-daf';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface DeletePastoralUseCaseRequest {
  pastoralId: string;
}

export class DeletePastoralUseCase {
  constructor(
    private pastoralsDaf: PastoralsDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({ pastoralId }: DeletePastoralUseCaseRequest): Promise<void> {
    const pastoral = await this.pastoralsDaf.findById(pastoralId);

    if (!pastoral) {
      throw new ResourceNotFoundError();
    }

    await this.attachmentsDaf.save(pastoral.coverId, { status: 'deleted' });
    await this.pastoralsDaf.delete(pastoralId);
  }
}
