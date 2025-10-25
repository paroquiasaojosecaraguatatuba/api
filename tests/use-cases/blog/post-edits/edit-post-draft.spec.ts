import { describe, beforeEach, it, expect } from 'vitest';
import { EditBlogPostDraftUseCase } from '@/use-cases/blog/post-drafts/edit-post-draft';
import { InMemoryAttachmentsDAF } from '@tests/database/in-memory-attachments-daf';
import { InMemoryUserDAF } from '@tests/database/in-memory-users-daf';
import type { User } from '@/entities/user';
import { makeUser } from '@tests/factories/make-user';
import { makeId } from '@/use-cases/factories/make-id';
import { makeAttachment } from '@tests/factories/make-attachment';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';
import { InMemoryBlogPostDraftsDAF } from '@tests/database/in-memory-blog-post-drafts-daf';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import type { BlogPostDraft } from '@/entities/blog-post-draft';
import { makeBlogPostDraft } from '@tests/factories/make-blog-post-draft';
import { NotAllowedError } from '@/use-cases/errors/not-allowed-error';

let postDraftDaf: InMemoryBlogPostDraftsDAF;
let attachmentsDaf: InMemoryAttachmentsDAF;
let usersDaf: InMemoryUserDAF;
let sut: EditBlogPostDraftUseCase;

let user: User;
let postDraft: BlogPostDraft;
let coverId: string;

describe('Create Post Edit Use Case', () => {
  beforeEach(async () => {
    usersDaf = new InMemoryUserDAF();
    postDraftDaf = new InMemoryBlogPostDraftsDAF();
    attachmentsDaf = new InMemoryAttachmentsDAF();
    sut = new EditBlogPostDraftUseCase(postDraftDaf, attachmentsDaf);

    user = await usersDaf.create(await makeUser());

    coverId = makeId();
    await attachmentsDaf.create(
      makeAttachment({ id: coverId, userId: user.id }),
    );

    postDraft = makeBlogPostDraft({
      authorId: user.id,
      coverId,
    });
    await postDraftDaf.create(postDraft);
  });

  it('should be able to edit a post edit', async () => {
    const { postDraft: newPostDraft } = await sut.execute({
      postDraftId: postDraft.id,
      title: 'New Post Edit Title',
      content: 'New content for the post edit',
      coverId: postDraft.coverId,
      excerpt: 'New excerpt for the post edit',
      userId: user.id,
      userRole: user.role,
    });

    expect(postDraft).toMatchObject(
      expect.objectContaining({
        id: newPostDraft.id,
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        excerpt: 'New excerpt for the post edit',
      }),
    );
  });

  it('should be able to edit a post edit as admin', async () => {
    const { postDraft: newPostDraft } = await sut.execute({
      postDraftId: postDraft.id,
      title: 'New Post Edit Title',
      content: 'New content for the post edit',
      coverId: postDraft.coverId,
      excerpt: 'New excerpt for the post edit',
      userId: makeId(),
      userRole: 'admin',
    });

    expect(postDraft).toMatchObject(
      expect.objectContaining({
        id: newPostDraft.id,
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        excerpt: 'New excerpt for the post edit',
      }),
    );
  });

  it('should be able to edit a post edit without excerpt', async () => {
    const { postDraft: newPostDraft } = await sut.execute({
      postDraftId: postDraft.id,
      title: 'New Post Edit Title',
      content: 'New content for the post edit',
      coverId: postDraft.coverId,
      userId: user.id,
      userRole: user.role,
    });

    expect(postDraft).toMatchObject(
      expect.objectContaining({
        id: newPostDraft.id,
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        excerpt: 'New content for the post edit',
      }),
    );
  });

  it('should be able to edit a cover', async () => {
    const attachment = makeAttachment({ userId: user.id });
    await attachmentsDaf.create(attachment);

    await sut.execute({
      postDraftId: postDraft.id,
      title: 'New Post Edit Title',
      content: 'New content for the post edit',
      coverId: attachment.id,
      userId: user.id,
      userRole: user.role,
    });

    const oldAttachment = await attachmentsDaf.findById(coverId);
    const newAttachment = await attachmentsDaf.findById(attachment.id);

    expect(oldAttachment?.status).toEqual('deleted');
    expect(newAttachment?.status).toEqual('attached');
  });

  it('should not be able to edit a post edit if user is not the author or admin', async () => {
    const anotherUser = await usersDaf.create(await makeUser());

    await expect(() =>
      sut.execute({
        postDraftId: postDraft.id,
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        coverId: postDraft.coverId,
        excerpt: 'New excerpt for the post edit',
        userId: anotherUser.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit a post edit with wrong post id', async () => {
    await expect(() =>
      sut.execute({
        postDraftId: 'mistaken-post-edit-id',
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        coverId: postDraft.coverId,
        excerpt: 'New excerpt for the post edit',
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a post edit with wrong cover id', async () => {
    await expect(() =>
      sut.execute({
        postDraftId: postDraft.id,
        title: 'New Post Edit Title',
        content: 'New content for the post edit',
        coverId: 'mistaken-cover-id',
        excerpt: 'New excerpt for the post edit',
        userId: user.id,
        userRole: user.role,
      }),
    ).rejects.toBeInstanceOf(AttachmentNotFoundError);
  });
});
