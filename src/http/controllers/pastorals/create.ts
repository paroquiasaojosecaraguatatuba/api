import { getAppContext } from '@/http/utils/getAppContext';
import { usePastoralSchema } from '@/schemas/use-pastoral-schema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { makeCreatePastoralUseCase } from '@/use-cases/factories/pastorals/make-create-pastoral-use-case';

export const createPastoral: ControllerFn = async (c) => {
  const { t, inputs } = getAppContext(c);

  const validationSchema = usePastoralSchema(t);

  const { name, description, responsibleName, contactPhone, coverId } =
    validationSchema.parse(inputs);

  try {
    const createUseCase = makeCreatePastoralUseCase(c);

    const { pastoral } = await createUseCase.execute({
      name,
      description,
      responsibleName,
      contactPhone,
      coverId,
    });

    return c.json({ pastoral }, 201);
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-pastoral-name-already-in-use') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
