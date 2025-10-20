import type { Clergy } from '@/entities/clergy';

export interface ClergyDAF {
  findById(id: string): Promise<Clergy | null>;
  findByName(name: string): Promise<Clergy | null>;
  findByPosition(position: Clergy['position']): Promise<Clergy | null>;
  findAll(): Promise<Clergy[]>;
  create(clergy: Clergy): Promise<void>;
  save(clergy: Clergy): Promise<void>;
  delete(id: string): Promise<void>;
}
