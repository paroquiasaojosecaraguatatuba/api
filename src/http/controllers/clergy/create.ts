import { getAppContext } from '@/http/utils/getAppContext';
import { useClergySchema } from '@/schemas/use-clergy-schema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { makeCreateClergyUseCase } from '@/use-cases/factories/clergy/make-create-clergy-use-case';
import { ClergyPositionAlreadyExistsError } from '@/use-cases/errors/clergy-position-already-exists-error';
import { NameAlreadyExistsError } from '@/use-cases/errors/name-already-exists-error';

export const createClergy: ControllerFn = async (c) => {
  const { t, inputs } = getAppContext(c);

  const validationSchema = useClergySchema(t);

  const { name, title, position, photoId } = validationSchema.parse(inputs);

  try {
    const createUseCase = makeCreateClergyUseCase(c);

    const { clergy } = await createUseCase.execute({
      name,
      title,
      position,
      photoId,
    });

    return c.json({ clergy }, 201);
  } catch (err) {
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
      return c.json({ message: t('error-photo-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
