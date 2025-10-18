import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { EditCommunityUseCase } from '../communities/edit-community';

export function makeEditCommunityUseCase(c: DomainContext) {
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const editCommunityUseCase = new EditCommunityUseCase(
    communitiesDaf,
    attachmentsDaf,
  );

  return editCommunityUseCase;
}
