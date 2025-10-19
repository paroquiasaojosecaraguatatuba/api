import { D1PastoralsDAF } from '@/services/database/d1/d1-pastorals-daf';
import { ListPastoralsUseCase } from '@/use-cases/pastorals/list-pastorals';

export function makeListPastoralsUseCase(c: DomainContext) {
  const pastoralsDaf = new D1PastoralsDAF(c.env.DB);
  const useCase = new ListPastoralsUseCase(pastoralsDaf);

  return useCase;
}
