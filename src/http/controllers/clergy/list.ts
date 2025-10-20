import { makeListClergyUseCase } from '@/use-cases/factories/clergy/make-list-clergy-use-case';

export const listClergy: ControllerFn = async (c) => {
  const listClergyUseCase = makeListClergyUseCase(c);

  const { clergy } = await listClergyUseCase.execute();

  return c.json({ clergy });
};
