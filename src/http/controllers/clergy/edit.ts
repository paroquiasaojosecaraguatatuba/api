import { getAppContext } from '@/http/utils/getAppContext';
import { useClergySchema } from '@/schemas/useClergySchema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { makeEditClergyUseCase } from '@/use-cases/factories/clergy/make-edit-clergy-use-case';
import { ClergyPositionAlreadyExistsError } from '@/use-cases/errors/clergy-position-already-exists-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

export const editClergy: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const validationSchema = useClergySchema(t);

  const { id } = params;

  const { name, title, position, photoId } = validationSchema.parse(inputs);

  try {
    const editUseCase = makeEditClergyUseCase(c);

    const { clergy } = await editUseCase.execute({
      clergyId: id,
      name,
      title,
      position,
      photoId,
    });

    return c.json(clergy);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return c.json({ message: t('error-clergy-not-found') }, 404);
    }

    if (err instanceof ClergyPositionAlreadyExistsError) {
      return c.json(
        { message: t('error-clergy-position-already-in-use') },
        400,
      );
    }

    if (err instanceof NameAlreadyExistsError) {
      return c.json({ message: t('error-clergy-name-already-in-use') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
