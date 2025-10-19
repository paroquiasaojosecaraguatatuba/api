import { D1PastoralsDAF } from '@/services/database/d1/d1-pastorals-daf';
import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { DeletePastoralUseCase } from '@/use-cases/pastorals/delete-pastoral';

export function makeDeletePastoralUseCase(c: DomainContext) {
  const pastoralsDaf = new D1PastoralsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const deletePastoralUseCase = new DeletePastoralUseCase(
    pastoralsDaf,
    attachmentsDaf,
  );

  return deletePastoralUseCase;
}
