import type { Pastoral } from '@/entities/pastoral';
import type { PastoralsDAF } from '../pastorals-daf';

export class D1PastoralsDAF implements PastoralsDAF {
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
  }

  async findById(id: string): Promise<Pastoral | null> {
    const pastoral = await this.d1
      .prepare(
        `SELECT id, name, slug, description, responsible_name, contact_phone, active, cover_id, created_at, updated_at
       FROM pastorals 
       WHERE id = ?`,
      )
      .bind(id)
      .first<{
        id: string;
        name: string;
        slug: string;
        description: string;
        responsible_name: string;
        contact_phone: string;
        active: number;
        cover_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!pastoral) {
      return null;
    }

    return {
      id: pastoral.id,
      name: pastoral.name,
      slug: pastoral.slug,
      description: pastoral.description,
      responsibleName: pastoral.responsible_name,
      contactPhone: pastoral.contact_phone,
      active: Boolean(pastoral.active),
      coverId: pastoral.cover_id,
      createdAt: pastoral.created_at,
      updatedAt: pastoral.updated_at,
    };
  }

  async findByName(name: string): Promise<Pastoral | null> {
    const pastoral = await this.d1
      .prepare(
        `SELECT id, name, slug, description, responsible_name, contact_phone, active, cover_id, created_at, updated_at
       FROM pastorals 
       WHERE name = ?`,
      )
      .bind(name)
      .first<{
        id: string;
        name: string;
        slug: string;
        description: string;
        responsible_name: string;
        contact_phone: string;
        active: number;
        cover_id: string;
        created_at: string;
        updated_at: string;
      }>();

    if (!pastoral) {
      return null;
    }

    return {
      id: pastoral.id,
      name: pastoral.name,
      slug: pastoral.slug,
      description: pastoral.description,
      responsibleName: pastoral.responsible_name,
      contactPhone: pastoral.contact_phone,
      active: Boolean(pastoral.active),
      coverId: pastoral.cover_id,
      createdAt: pastoral.created_at,
      updatedAt: pastoral.updated_at,
    };
  }

  async findAll(): Promise<Pastoral[]> {
    const pastorals = await this.d1
      .prepare(
        `SELECT id, name, slug, description, responsible_name, contact_phone, active, cover_id, created_at, updated_at
       FROM pastorals`,
      )
      .all<{
        id: string;
        name: string;
        slug: string;
        description: string;
        responsible_name: string;
        contact_phone: string;
        active: number;
        cover_id: string;
        created_at: string;
        updated_at: string;
      }>();

    return pastorals.results.map((pastoral) => ({
      id: pastoral.id,
      name: pastoral.name,
      slug: pastoral.slug,
      description: pastoral.description,
      responsibleName: pastoral.responsible_name,
      contactPhone: pastoral.contact_phone,
      active: Boolean(pastoral.active),
      coverId: pastoral.cover_id,
      createdAt: pastoral.created_at,
      updatedAt: pastoral.updated_at,
    }));
  }

  async create({
    id,
    name,
    slug,
    active,
    description,
    responsibleName,
    coverId,
    contactPhone,
    createdAt,
  }: Pastoral): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO pastorals 
       (id, name, slug, description, responsible_name, contact_phone, active, cover_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        name,
        slug,
        description,
        responsibleName,
        contactPhone,
        active,
        coverId,
        createdAt,
      )
      .run();
  }

  async save(pastoral: Pastoral): Promise<void> {
    await this.d1
      .prepare(
        `UPDATE pastorals 
       SET name = ?, slug = ?, description = ?, responsible_name = ?, contact_phone = ?, active = ?, updated_at = ?, cover_id = ?
       WHERE id = ?`,
      )
      .bind(
        pastoral.name,
        pastoral.slug,
        pastoral.description,
        pastoral.responsibleName,
        pastoral.contactPhone,
        pastoral.active,
        pastoral.updatedAt,
        pastoral.coverId,
        pastoral.id,
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.d1.prepare('DELETE FROM pastorals WHERE id = ?').bind(id).run();
  }
}
