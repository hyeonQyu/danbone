import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdict-entries.repository.types';
import { JmdictSearchIndexesRepository } from '@/data/server/repositories/jmdict/server.jmdict-search-indexes.repository.types';
import { JmdictEntry } from '@/features/dictionary/jmdict.types';

export interface JmdictServerService {
  saveEntries: (batch: JmdictEntry[]) => Promise<{
    savedEntries: number;
    savedIndexes: number;
    duration: number;
  }>;
  getStoredCount: () => Promise<number>;
}

export interface JmdictServerServiceDependencies {
  jmdictEntriesRepository: JmdictEntriesRepository;
  jmdictSearchIndexesRepository: JmdictSearchIndexesRepository;
}
