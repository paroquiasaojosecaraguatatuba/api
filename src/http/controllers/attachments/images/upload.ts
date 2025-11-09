import { getAppContext } from '@/http/utils/getAppContext';
import { useImageSchema } from '@/schemas/use-image-schema';
import { makeUploadImageUseCase } from '@/use-cases/factories/attachments/make-upload-image-use-case';

export const upload: ControllerFn = async (c) => {
  const { user, inputs, t } = getAppContext(c);

  const validationSchema = useImageSchema(t);

  const { file } = validationSchema.parse(inputs) as { file: File };

  const uploadImageUseCase = makeUploadImageUseCase(c);

  const { attachmentId } = await uploadImageUseCase.execute({
    file,
    userId: user.id,
    storageProvider: 'r2',
  });

  return c.json({ attachmentId }, 201);
};
