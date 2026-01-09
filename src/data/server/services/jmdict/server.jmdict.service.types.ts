import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdict-entries.repository.types';
import { JmdictSearchIndexesRepository } from '@/data/server/repositories/jmdict/server.jmdict-search-indexes.repository.types';
import { JmdictEntry } from '@/features/dictionary/jmdict.types';

export interface JmdictServerService {
  saveNextBatch: (
    allEntries: JmdictEntry[],
    batchSize: number,
  ) => Promise<{
    savedEntries: number;
    savedIndexes: number;
    totalStored: number;
    isComplete: boolean;
    duration: number;
  }>;
}

export interface JmdictServerServiceDependencies {
  jmdictEntriesRepository: JmdictEntriesRepository;
  jmdictSearchIndexesRepository: JmdictSearchIndexesRepository;
}
