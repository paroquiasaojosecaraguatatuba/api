import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1PastoralsDAF } from '@/services/database/d1/d1-pastorals-daf';
import { CreatePastoralUseCase } from '@/use-cases/pastorals/create-pastoral';

export function makeCreatePastoralUseCase(c: DomainContext) {
  const pastoralsDaf = new D1PastoralsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createPastoralUseCase = new CreatePastoralUseCase(
    pastoralsDaf,
    attachmentsDaf,
  );

  return createPastoralUseCase;
}
