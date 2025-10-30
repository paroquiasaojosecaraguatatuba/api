import type { MassScheduleException } from '@/entities/mass-schedule-exception';
import type { MassScheduleExceptionsDAF } from '../mass-schedule-exceptions-daf';

export class D1MassScheduleExceptionsDAF implements MassScheduleExceptionsDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findUnique(
    scheduleId: string,
    exceptionDate: string,
    startTime: string,
  ): Promise<MassScheduleException | null> {
    const exception = await this.d1
      .prepare(
        `SELECT *
        FROM mass_schedule_exceptions
        WHERE schedule_id = ?
          AND exception_date = ?
          AND start_time = ?
        LIMIT 1`,
      )
      .bind(scheduleId, exceptionDate, startTime)
      .first<{
        id: string;
        schedule_id: string;
        exception_date: string;
        start_time: string;
        reason: string;
        created_by: string;
        created_at: string;
      }>();

    if (!exception) {
      return null;
    }

    return {
      id: exception.id,
      scheduleId: exception.schedule_id,
      exceptionDate: exception.exception_date,
      startTime: exception.start_time,
      reason: exception.reason,
      createdBy: exception.created_by,
      createdAt: exception.created_at,
    };
  }

  async findById(id: string): Promise<MassScheduleException | null> {
    const exception = await this.d1
      .prepare(
        `SELECT *
        FROM mass_schedule_exceptions
        WHERE id = ?
        LIMIT 1`,
      )
      .bind(id)
      .first<{
        id: string;
        schedule_id: string;
        exception_date: string;
        start_time: string;
        reason: string;
        created_by: string;
        created_at: string;
      }>();

    if (!exception) {
      return null;
    }

    return {
      id: exception.id,
      scheduleId: exception.schedule_id,
      exceptionDate: exception.exception_date,
      startTime: exception.start_time,
      reason: exception.reason,
      createdBy: exception.created_by,
      createdAt: exception.created_at,
    };
  }

  async findMany({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<MassScheduleException[]> {
    const exceptions = await this.d1
      .prepare(
        `SELECT *
        FROM mass_schedule_exceptions
        WHERE exception_date BETWEEN ? AND ?`,
      )
      .bind(from, to)
      .all<{
        id: string;
        schedule_id: string;
        exception_date: string;
        start_time: string;
        reason: string;
        created_by: string;
        created_at: string;
      }>();

    return exceptions.results.map((exception) => ({
      id: exception.id,
      scheduleId: exception.schedule_id,
      exceptionDate: exception.exception_date,
      startTime: exception.start_time,
      reason: exception.reason,
      createdBy: exception.created_by,
      createdAt: exception.created_at,
    }));
  }

  async create(exception: MassScheduleException): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO mass_schedule_exceptions
        (id, schedule_id, exception_date, start_time, reason, created_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        exception.id,
        exception.scheduleId,
        exception.exceptionDate,
        exception.startTime,
        exception.reason,
        exception.createdBy,
        exception.createdAt,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.d1
      .prepare(
        `DELETE FROM mass_schedule_exceptions
        WHERE id = ?`,
      )
      .bind(id)
      .run();
  }
}
