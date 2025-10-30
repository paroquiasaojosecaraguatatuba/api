import { D1MassScheduleExceptionsDAF } from '@/services/database/d1/d1-mass-schedule-exceptions-daf';
import { D1MassSchedulesDAF } from '@/services/database/d1/d1-mass-schedules-daf';
import { CreateMassScheduleExceptionUseCase } from '@/use-cases/mass-schedule-exceptions/create';

export function makeCreateMassScheduleException(c: DomainContext) {
  const massSchedulesDaf = new D1MassSchedulesDAF(c.env.DB);
  const massScheduleExceptionsDaf = new D1MassScheduleExceptionsDAF(c.env.DB);

  const useCase = new CreateMassScheduleExceptionUseCase(
    massSchedulesDaf,
    massScheduleExceptionsDaf,
  );

  return useCase;
}
