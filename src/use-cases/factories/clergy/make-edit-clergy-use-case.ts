import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1ClergyDAF } from '@/services/database/d1/d1-clergy-daf';
import { EditClergyUseCase } from '@/use-cases/clergy/edit-clergy';

export function makeEditClergyUseCase(c: DomainContext) {
  const clergyDaf = new D1ClergyDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const editClergyUseCase = new EditClergyUseCase(clergyDaf, attachmentsDaf);

  return editClergyUseCase;
}
