import { DocumentEntity } from '@/data/entity.types';
import { TargetLanguage } from '@/language';

export interface LearningBaseParams {
  userId: string;
  targetLanguage: TargetLanguage;
}

export interface LearningEntryParams extends LearningBaseParams {
  entryId: string;
}

export interface LearningEntriesParams extends LearningBaseParams {
  entryIds: string[];
}

export interface VocabularyBookEntity extends DocumentEntity, LearningEntriesParams {
  name: string;
  color: string;
}

export interface VocabularyLearningEntity extends DocumentEntity, LearningEntryParams {
  masteryLevel: number;
  reviewCount: number;
  correctCount: number;
  lastReviewedAt: Date | null;
  memo?: string;
  tags?: string[];
}

export interface VocabularyEntryWithLearning<T extends { id: string }> {
  entryId: string;
  dictionaryEntry: T;
  learning: VocabularyLearningEntity;
}

export interface CreateVocabularyBookParams {
  userId: string;
  name: string;
  color: string;
  targetLanguage: TargetLanguage;
}

export interface UpdateVocabularyBookParams {
  name?: string;
  color?: string;
  entryIds?: string[];
}

export type UpdateVocabularyLearningParams = Partial<Omit<VocabularyLearningEntity, keyof LearningEntryParams | keyof DocumentEntity>>;
