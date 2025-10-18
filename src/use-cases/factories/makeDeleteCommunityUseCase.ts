import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { DeleteCommunityUseCase } from '../communities/delete-community';

export function makeDeleteCommunityUseCase(c: DomainContext) {
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);
  const deleteCommunityUseCase = new DeleteCommunityUseCase(communitiesDaf);

  return deleteCommunityUseCase;
}
