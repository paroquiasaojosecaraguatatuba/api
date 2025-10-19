import { makeListCommunitiesUseCase } from '@/use-cases/factories/makeListCommunitiesUseCase';

export const listCommunities: ControllerFn = async (c) => {
  const listCommunitiesUseCase = makeListCommunitiesUseCase(c);

  const { communities } = await listCommunitiesUseCase.execute();

  return c.json({ communities });
};
