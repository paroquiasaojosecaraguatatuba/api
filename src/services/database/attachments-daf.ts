export interface AttachmentsDAF {
  create: (attachment: {
    id: string;
    filename: string;
    mimeType: string;
    userId: string;
  }) => Promise<void>;
}
