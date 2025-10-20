import type { Clergy } from '@/entities/clergy';
import type { ClergyDAF } from '../clergy-daf';

export class D1ClergyDAF implements ClergyDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string): Promise<Clergy | null> {
    const clergy = await this.d1
      .prepare(
        `SELECT id, title, name, slug, position, photo_id, created_at, updated_at
       FROM clergy 
       WHERE id = ?`,
      )
      .bind(id)
      .first<{
        id: string;
        title: string;
        name: string;
        slug: string;
        position: string;
        photo_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!clergy) {
      return null;
    }

    return {
      id: clergy.id,
      title: clergy.title,
      name: clergy.name,
      slug: clergy.slug,
      position: clergy.position as Clergy['position'],
      photoId: clergy.photo_id,
      createdAt: clergy.created_at,
      updatedAt: clergy.updated_at,
    };
  }

  async findByName(name: string): Promise<Clergy | null> {
    const clergy = await this.d1
      .prepare(
        `SELECT id, title, name, slug, position, photo_id, created_at, updated_at
       FROM clergy 
       WHERE name = ?`,
      )
      .bind(name)
      .first<{
        id: string;
        title: string;
        name: string;
        slug: string;
        position: string;
        photo_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!clergy) {
      return null;
    }

    return {
      id: clergy.id,
      title: clergy.title,
      name: clergy.name,
      slug: clergy.slug,
      position: clergy.position as Clergy['position'],
      photoId: clergy.photo_id,
      createdAt: clergy.created_at,
      updatedAt: clergy.updated_at,
    };
  }

  async findByPosition(position: Clergy['position']): Promise<Clergy | null> {
    const clergy = await this.d1
      .prepare(
        `SELECT id, title, name, slug, position, photo_id, created_at, updated_at
       FROM clergy 
       WHERE position = ?`,
      )
      .bind(position)
      .first<{
        id: string;
        title: string;
        name: string;
        slug: string;
        position: string;
        photo_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!clergy) {
      return null;
    }

    return {
      id: clergy.id,
      title: clergy.title,
      name: clergy.name,
      slug: clergy.slug,
      position: clergy.position as Clergy['position'],
      photoId: clergy.photo_id,
      createdAt: clergy.created_at,
      updatedAt: clergy.updated_at,
    };
  }

  async findAll(): Promise<Clergy[]> {
    const clergyList = await this.d1
      .prepare(
        `SELECT id, title, name, slug, position, photo_id, created_at, updated_at
       FROM clergy`,
      )
      .all<{
        id: string;
        title: string;
        name: string;
        slug: string;
        position: string;
        photo_id: string;
        created_at: string;
        updated_at: string;
      }>();

    return clergyList.results.map((clergy) => ({
      id: clergy.id,
      title: clergy.title,
      name: clergy.name,
      slug: clergy.slug,
      position: clergy.position as Clergy['position'],
      photoId: clergy.photo_id,
      createdAt: clergy.created_at,
      updatedAt: clergy.updated_at,
    }));
  }

  async create(clergy: Clergy): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO clergy (id, title, name, slug, position, photo_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        clergy.id,
        clergy.title,
        clergy.name,
        clergy.slug,
        clergy.position,
        clergy.photoId,
        clergy.createdAt,
        clergy.updatedAt || null,
      )
      .run();
  }

  async save(clergy: Clergy): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE clergy
       SET title = ?, name = ?, slug = ?, position = ?, photo_id = ?, updated_at = ?
       WHERE id = ?`,
      )
      .bind(
        clergy.title,
        clergy.name,
        clergy.slug,
        clergy.position,
        clergy.photoId,
        clergy.updatedAt || null,
        clergy.id,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.d1.prepare('DELETE FROM clergy WHERE id = ?').bind(id).run();
  }
}
