import type { Pastoral } from '@/entities/pastoral';
import type { PastoralsDAF } from '@/services/database/pastorals-daf';

export class InMemoryPastoralsDAF implements PastoralsDAF {
  public pastorals: Pastoral[] = [];

  async findById(id: string): Promise<Pastoral | null> {
    const pastoral = this.pastorals.find((p) => p.id === id);

    return pastoral || null;
  }

  async findByName(name: string): Promise<Pastoral | null> {
    const pastoral = this.pastorals.find((p) => p.name === name);

    return pastoral || null;
  }

  async findAll(): Promise<Pastoral[]> {
    return this.pastorals;
  }

  async create(pastoral: Pastoral): Promise<void> {
    this.pastorals.push(pastoral);
  }

  async save(pastoral: Pastoral): Promise<void> {
    const index = this.pastorals.findIndex((p) => p.id === pastoral.id);

    if (index >= 0) {
      this.pastorals[index] = pastoral;
    }
  }

  async delete(id: string): Promise<void> {
    this.pastorals = this.pastorals.filter((p) => p.id !== id);
  }
}
