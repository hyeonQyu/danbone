import { JmdictServerRepository } from '@/data/server/repositories/jmdict';
import { JmdictEntry } from '@/features/dictionary/jmdict.types';

export interface JmdictServerService {
  saveNextBatch: (allEntries: JmdictEntry[]) => Promise<{
    savedEntries: number;
    savedIndexes: number;
    totalStored: number;
    isComplete: boolean;
    duration: number;
  }>;
}

export interface JmdictServerServiceDependencies {
  jmdictRepository: JmdictServerRepository;
}
