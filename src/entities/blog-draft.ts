export type BlogDraft = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  eventDate?: string;
  scheduledPublishAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
};
