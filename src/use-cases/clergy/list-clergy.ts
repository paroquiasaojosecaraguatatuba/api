import type { Clergy } from '@/entities/clergy';
import type { ClergyDAF } from '@/services/database/clergy-daf';

interface ListClergyUseCaseResponse {
  clergy: Clergy[];
}

export class ListClergyUseCase {
  constructor(private clergyDaf: ClergyDAF) {}

  async execute(): Promise<ListClergyUseCaseResponse> {
    const clergy = await this.clergyDaf.findAll();

    return { clergy };
  }
}
