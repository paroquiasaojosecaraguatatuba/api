import type { BlogDraft } from '@/entities/blog-draft';
import type { User } from '@/entities/user';
import type { AttachmentsDAF } from '@/services/database/attachments-daf';
import type { BlogDraftsDAF } from '@/services/database/blog-drafts-daf';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

interface DeleteBlogDraftUseCaseRequest {
  draftId: string;
  userId: string;
  userRole: User['role'];
}

export class DeleteBlogDraftUseCase {
  constructor(
    private draftDaf: BlogDraftsDAF,
    private attachmentsDaf: AttachmentsDAF,
  ) {}

  async execute({
    draftId,
    userId,
    userRole,
  }: DeleteBlogDraftUseCaseRequest): Promise<void> {
    const draft = await this.draftDaf.findById(draftId);

    if (!draft) {
      throw new ResourceNotFoundError();
    }

    if (draft.authorId !== userId && userRole !== 'admin') {
      throw new NotAllowedError();
    }

    await this.attachmentsDaf.save(draft.coverId, { status: 'deleted' });
    await this.draftDaf.delete(draftId);
  }
}
