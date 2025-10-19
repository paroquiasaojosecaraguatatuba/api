import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { DeleteCommunityUseCase } from '@/use-cases/communities/delete-community';

export function makeDeleteCommunityUseCase(c: DomainContext) {
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const deleteCommunityUseCase = new DeleteCommunityUseCase(
    communitiesDaf,
    attachmentsDaf,
  );

  return deleteCommunityUseCase;
}
