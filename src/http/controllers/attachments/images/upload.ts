import { getAppContext } from '@/http/utils/getAppContext';
import { useImageSchema } from '@/schemas/useImageSchema';
import { makeUploadImageUseCase } from '@/use-cases/factories/makeUploadImageUseCase';

export const upload: ControllerFn = async (c) => {
  const { user, inputs, t } = getAppContext(c);

  const validationSchema = useImageSchema(t);

  const { file } = validationSchema.parse(inputs) as { file: File };

  const uploadImageUseCase = makeUploadImageUseCase(c);

  const storageFile = await uploadImageUseCase.execute({
    file,
    userId: user.id,
  });

  return c.json({ file: storageFile });
};
