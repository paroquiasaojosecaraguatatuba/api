import { D1MassScheduleExceptionsDAF } from '@/services/database/d1/d1-mass-schedule-exceptions-daf';
import { DeleteMassScheduleExceptionUseCase } from '@/use-cases/mass-schedule-exceptions/delete';

export function makeDeleteMassScheduleException(c: DomainContext) {
  const massScheduleExceptionsDaf = new D1MassScheduleExceptionsDAF(c.env.DB);

  const useCase = new DeleteMassScheduleExceptionUseCase(
    massScheduleExceptionsDaf,
  );

  return useCase;
}
