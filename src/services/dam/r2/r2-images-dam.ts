import { ImagesDAM } from '../images-dam';

export class R2ImagesDAM implements ImagesDAM {
  private r2: R2Bucket;

  constructor(r2: R2Bucket) {
    this.r2 = r2;
  }

  async upload({ filename, file }: { filename: string; file: File }) {
    const arrayBuffer = await file.arrayBuffer();

    await this.r2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });
  }
}
