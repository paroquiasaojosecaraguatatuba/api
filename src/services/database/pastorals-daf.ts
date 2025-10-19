import type { Pastoral } from '@/entities/pastoral';

export interface PastoralsDAF {
  findById(id: string): Promise<Pastoral | null>;
  findByName(name: string): Promise<Pastoral | null>;
  findAll(): Promise<Pastoral[]>;
  create(pastoral: Pastoral): Promise<void>;
  save(pastoral: Pastoral): Promise<void>;
  delete(id: string): Promise<void>;
}
