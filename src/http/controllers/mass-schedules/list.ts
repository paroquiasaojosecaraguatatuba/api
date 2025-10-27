import { makeListMassSchedules } from '@/use-cases/factories/mass-schedules/make-list-mass-schedules';

export const listMassSchedules: ControllerFn = async (c) => {
  const listUseCase = makeListMassSchedules(c);

  const { massSchedules } = await listUseCase.execute();

  return c.json({ massSchedules });
};
