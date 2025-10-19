import { makeListPastoralsUseCase } from '@/use-cases/factories/pastorals/make-list-pastorals-use-case';

export const listPastorals: ControllerFn = async (c) => {
  const listPastoralsUseCase = makeListPastoralsUseCase(c);

  const { pastorals } = await listPastoralsUseCase.execute();

  return c.json({ pastorals });
};
