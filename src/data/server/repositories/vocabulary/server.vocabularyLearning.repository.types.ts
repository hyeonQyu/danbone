import {
  LearningEntriesParams,
  LearningEntryParams,
  UpdateVocabularyLearningParams,
  VocabularyLearningEntity,
} from '@/features/vocabulary';

export interface UpdateLearningParams extends LearningEntryParams {
  updates: UpdateVocabularyLearningParams;
}

type CreateVocabularyLearningParams = LearningEntryParams;
type FindByEntryParams = LearningEntryParams;
type FindByEntriesParams = LearningEntriesParams;
type DeleteLearningParams = LearningEntryParams;

export interface VocabularyLearningRepository {
  create: (params: CreateVocabularyLearningParams) => Promise<VocabularyLearningEntity>;
  findByEntry: (params: FindByEntryParams) => Promise<VocabularyLearningEntity | null>;
  findByEntries: (params: FindByEntriesParams) => Promise<VocabularyLearningEntity[]>;
  update: (params: UpdateLearningParams) => Promise<void>;
  delete: (params: DeleteLearningParams) => Promise<void>;
}
