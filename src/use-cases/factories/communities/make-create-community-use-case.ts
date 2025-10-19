import { D1AttachmentsDAF } from '@/services/database/d1/d1-attachments-daf';
import { D1CommunitiesDAF } from '@/services/database/d1/d1-communities-daf';
import { CreateCommunityUseCase } from '@/use-cases/communities/create-community';

export function makeCreateCommunityUseCase(c: DomainContext) {
  const communitiesDaf = new D1CommunitiesDAF(c.env.DB);
  const attachmentsDaf = new D1AttachmentsDAF(c.env.DB);
  const createCommunityUseCase = new CreateCommunityUseCase(
    communitiesDaf,
    attachmentsDaf,
  );

  return createCommunityUseCase;
}
