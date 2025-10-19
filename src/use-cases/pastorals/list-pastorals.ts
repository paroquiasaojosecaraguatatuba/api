import type { Pastoral } from '@/entities/pastoral';
import type { PastoralsDAF } from '@/services/database/pastorals-daf';

interface ListPastoralsUseCaseResponse {
  pastorals: Pastoral[];
}

export class ListPastoralsUseCase {
  constructor(private pastoralsDaf: PastoralsDAF) {}

  async execute(): Promise<ListPastoralsUseCaseResponse> {
    const pastorals = await this.pastoralsDaf.findAll();

    return { pastorals };
  }
}
