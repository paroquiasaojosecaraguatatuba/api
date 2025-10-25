export type BlogPostDraft = {
  id: string;
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  lastAutoSaveAt?: string;
  createdAt: string;
  updatedAt?: string;
};
