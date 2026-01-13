import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdictEntries.repository.types';
import { JmdictSearchIndexesRepository } from '@/data/server/repositories/jmdict/server.jmdictSearchIndexes.repository.types';
import { JmdictEntity, JmdictTermType } from '@/features/dictionary';
import { JmdictEntry } from '@/features/dictionary/jmdict.types';

export interface FindByTermParams {
  searchTerm: string;
  termType: JmdictTermType;
}

export interface JmdictServerService {
  saveEntries: (batch: JmdictEntry[]) => Promise<{
    savedEntries: number;
    savedIndexes: number;
  }>;
  updateEntries: (batch: JmdictEntry[]) => Promise<{
    updatedEntries: number;
  }>;
  getStoredCount: () => Promise<number>;
  findById: (id: string) => Promise<JmdictEntity | null>;
  findByTerm: (params: FindByTermParams) => Promise<JmdictEntity[]>;
}

export interface JmdictServerServiceDependencies {
  jmdictEntriesRepository: JmdictEntriesRepository;
  jmdictSearchIndexesRepository: JmdictSearchIndexesRepository;
}
