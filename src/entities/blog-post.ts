export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  eventDate?: string;
  publishedAt: string;
  unpublishedAt?: string;
  scheduledUnpublishAt?: string;
  coverId: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  editId?: string;
};
