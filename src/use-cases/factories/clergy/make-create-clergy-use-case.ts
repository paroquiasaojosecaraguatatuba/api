import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1ClergyDAF } from '@/services/database/d1/d1-clergy-daf';
import { CreateClergyUseCase } from '@/use-cases/clergy/create-clergy';

export function makeCreateClergyUseCase(c: DomainContext) {
  const clergyDaf = new D1ClergyDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createClergyUseCase = new CreateClergyUseCase(
    clergyDaf,
    attachmentsDaf,
  );

  return createClergyUseCase;
}
