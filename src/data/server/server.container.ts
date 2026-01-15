import { jmdictEntriesRepository, jmdictSearchIndexesRepository } from '@/data/server/repositories/jmdict';
import { usersServerRepository } from '@/data/server/repositories/users';
import { vocabularyBooksRepository, vocabularyLearningRepository } from '@/data/server/repositories/vocabulary';
import { createUserServerService } from '@/data/server/services';
import { createJmdictServerService } from '@/data/server/services/jmdict';
import { createVocabularyServerService } from '@/data/server/services/vocabulary/server.vocabulary.service';

export const userServiceServer = createUserServerService({ usersRepository: usersServerRepository });
export const jmdictServiceServer = createJmdictServerService({
  jmdictEntriesRepository,
  jmdictSearchIndexesRepository,
});
export const vocabularyServiceServer = createVocabularyServerService({
  vocabularyBooksRepository,
  vocabularyLearningRepository,
  jmdictEntriesRepository,
});
