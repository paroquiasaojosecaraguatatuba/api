export interface ImagesDAM {
  upload(params: { filename: string; file: File }): Promise<void>;
}
