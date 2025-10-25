export type BlogPostHistory = {
  id: string;
  postId: string;
  action: 'published' | 'unpublished' | 'edited';
  userId: string;
  changesSummary?: string;
  createdAt: string;
};
