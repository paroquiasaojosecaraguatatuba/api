import type { EventSchedule } from '@/entities/event-schedule';
import type { EventSchedulesDAF } from '../event-schedules-daf';

export class D1EventSchedulesDAF implements EventSchedulesDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string) {
    const eventSchedule = await this.d1
      .prepare('SELECT * FROM event_schedules WHERE id = ?')
      .bind(id)
      .first<{
        id: string;
        communityId: string;
        title: string;
        type: string;
        eventDate: string;
        startTime: string;
        endTime: string | null;
        customLocation: string | null;
        orientations: string | null;
        createdAt: string;
        updatedAt: string | null;
      }>();

    if (!eventSchedule) {
      return null;
    }

    return {
      id: eventSchedule.id,
      communityId: eventSchedule.communityId,
      title: eventSchedule.title,
      type: eventSchedule.type as EventSchedule['type'],
      eventDate: eventSchedule.eventDate,
      startTime: eventSchedule.startTime,
      endTime: eventSchedule.endTime ?? undefined,
      customLocation: eventSchedule.customLocation ?? undefined,
      orientations: eventSchedule.orientations ?? undefined,
      createdAt: eventSchedule.createdAt,
      updatedAt: eventSchedule.updatedAt ?? undefined,
    };
  }

  async findMany(data: { from: string; to: string }): Promise<EventSchedule[]> {
    const eventSchedules = await this.d1
      .prepare(
        'SELECT * FROM event_schedules WHERE eventDate BETWEEN ? AND ? ORDER BY eventDate, startTime',
      )
      .bind(data.from, data.to)
      .all<{
        id: string;
        communityId: string;
        title: string;
        type: string;
        eventDate: string;
        startTime: string;
        endTime: string | null;
        customLocation: string | null;
        orientations: string | null;
        createdAt: string;
        updatedAt: string | null;
      }>();

    return eventSchedules.results.map((eventSchedule) => ({
      id: eventSchedule.id,
      communityId: eventSchedule.communityId,
      title: eventSchedule.title,
      type: eventSchedule.type as EventSchedule['type'],
      eventDate: eventSchedule.eventDate,
      startTime: eventSchedule.startTime,
      endTime: eventSchedule.endTime ?? undefined,
      customLocation: eventSchedule.customLocation ?? undefined,
      orientations: eventSchedule.orientations ?? undefined,
      createdAt: eventSchedule.createdAt,
      updatedAt: eventSchedule.updatedAt ?? undefined,
    }));
  }

  async create({
    id,
    communityId,
    createdAt,
    eventDate,
    startTime,
    title,
    type,
    customLocation,
    endTime,
    orientations,
    updatedAt,
  }: EventSchedule): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO event_schedules (
          id,
          communityId,
          title,
          type,
          eventDate,
          startTime,
          endTime,
          customLocation,
          orientations,
          createdAt,
          updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        communityId,
        title,
        type,
        eventDate,
        startTime,
        endTime ?? null,
        customLocation ?? null,
        orientations ?? null,
        createdAt,
        updatedAt ?? null,
      )
      .run();
  }

  async update(eventSchedule: EventSchedule): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE event_schedules SET
          communityId = ?,
          title = ?,
          type = ?,
          eventDate = ?,
          startTime = ?,
          endTime = ?,
          customLocation = ?,
          orientations = ?,
          createdAt = ?,
          updatedAt = ?
        WHERE id = ?`,
      )
      .bind(
        eventSchedule.communityId,
        eventSchedule.title,
        eventSchedule.type,
        eventSchedule.eventDate,
        eventSchedule.startTime,
        eventSchedule.endTime ?? null,
        eventSchedule.customLocation ?? null,
        eventSchedule.orientations ?? null,
        eventSchedule.createdAt,
        eventSchedule.updatedAt ?? null,
        eventSchedule.id,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.d1
      .prepare('DELETE FROM event_schedules WHERE id = ?')
      .bind(id)
      .run();
  }
}
