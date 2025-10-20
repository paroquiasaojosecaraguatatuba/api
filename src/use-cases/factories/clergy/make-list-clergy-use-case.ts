import { D1ClergyDAF } from '@/services/database/d1/d1-clergy-daf';
import { ListClergyUseCase } from '@/use-cases/clergy/list-clergy';

export function makeListClergyUseCase(c: DomainContext) {
  const clergyDaf = new D1ClergyDAF(c.env.DB);
  const listClergyUseCase = new ListClergyUseCase(clergyDaf);

  return listClergyUseCase;
}
