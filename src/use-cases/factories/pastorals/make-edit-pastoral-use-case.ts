import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1PastoralsDAF } from '@/services/database/d1/d1-pastorals-daf';
import { EditPastoralUseCase } from '@/use-cases/pastorals/edit-pastoral';

export function makeEditPastoralUseCase(c: DomainContext) {
  const pastoralsDaf = new D1PastoralsDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const editPastoralUseCase = new EditPastoralUseCase(
    pastoralsDaf,
    attachmentsDaf,
  );

  return editPastoralUseCase;
}
