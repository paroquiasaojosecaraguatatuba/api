import { getAppContext } from '@/http/utils/getAppContext';
import { usePastoralSchema } from '@/schemas/usePastoralSchema';
import { AttachmentNotFoundError } from '@/use-cases/errors/attachment-not-found-error';
import { ResourceAlreadyExistsError } from '@/use-cases/errors/resource-already-exists-error';
import { makeEditPastoralUseCase } from '@/use-cases/factories/pastorals/make-edit-pastoral-use-case';

export const editPastoral: ControllerFn = async (c) => {
  const { t, inputs, params } = getAppContext(c);

  const validationSchema = usePastoralSchema(t);

  const { id } = params;

  const { name, description, responsibleName, contactPhone, coverId } =
    validationSchema.parse(inputs);

  try {
    const editUseCase = makeEditPastoralUseCase(c);

    const { pastoral } = await editUseCase.execute({
      id,
      name,
      description,
      responsibleName,
      contactPhone,
      coverId,
    });

    return c.json(pastoral);
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return c.json({ message: t('error-name-already-in-use') }, 400);
    }

    if (err instanceof AttachmentNotFoundError) {
      return c.json({ message: t('error-cover-not-uploaded-yet') }, 400);
    }

    throw err;
  }
};
