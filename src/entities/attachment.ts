export type Attachment = {
  id: string;
  filename: string;
  mimeType: string;
  userId: string;
  status: 'pending' | 'attached' | 'deleted';
  storageProvider: 'r2';
  uploadedAt: string;
};
