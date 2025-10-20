import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1ClergyDAF } from '@/services/database/d1/d1-clergy-daf';
import { DeleteClergyUseCase } from '@/use-cases/clergy/delete-clergy';

export function makeDeleteClergyUseCase(c: DomainContext) {
  const clergyDaf = new D1ClergyDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const deleteClergyUseCase = new DeleteClergyUseCase(
    clergyDaf,
    attachmentsDaf,
  );

  return deleteClergyUseCase;
}
