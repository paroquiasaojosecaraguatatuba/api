import type { Clergy } from '@/entities/clergy';
import type { ClergyDAF } from '@/services/database/clergy-daf';

export class InMemoryClergyDAF implements ClergyDAF {
  public clergy: Clergy[] = [];

  async findById(id: string): Promise<Clergy | null> {
    const clergy = this.clergy.find((p) => p.id === id);

    return clergy || null;
  }

  async findByName(name: string): Promise<Clergy | null> {
    const clergy = this.clergy.find((p) => p.name === name);

    return clergy || null;
  }

  async findByPosition(position: string): Promise<Clergy | null> {
    const clergy = this.clergy.find((p) => p.position === position);

    return clergy || null;
  }

  async findAll(): Promise<Clergy[]> {
    return this.clergy;
  }

  async create(clergy: Clergy): Promise<void> {
    this.clergy.push(clergy);
  }

  async save(clergy: Clergy): Promise<void> {
    const index = this.clergy.findIndex((p) => p.id === clergy.id);

    if (index >= 0) {
      this.clergy[index] = clergy;
    }
  }

  async delete(id: string): Promise<void> {
    this.clergy = this.clergy.filter((p) => p.id !== id);
  }
}
