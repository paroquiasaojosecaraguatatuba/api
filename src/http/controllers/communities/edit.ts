import { getAppContext } from '@/http/utils/getAppContext';
import { useCommunitySchema } from '@/schemas/useCommunitySchema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ParishAlreadyExistsError } from '@/use-cases/errors/parish-already-exists-error';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { makeEditCommunityUseCase } from '@/use-cases/factories/makeEditCommunityUseCase';

export const editCommunity: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const validationSchema = useCommunitySchema(t);

  const { id } = params;

  const { name, type, address, coverId } = validationSchema.parse(inputs);

  try {
    const editUseCase = makeEditCommunityUseCase(c);

    const { community } = await editUseCase.execute({
      id,
      name,
      type,
      address,
      coverId,
    });

    return c.json({ community });
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-name-already-in-use') }, 400);
    }

    if (err instanceof ParishAlreadyExistsError) {
      return c.json({ message: t('error-parish-already-exists') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
