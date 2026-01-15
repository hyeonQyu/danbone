import type { CreateVocabularyBookParams, UpdateVocabularyBookParams, VocabularyBookEntity } from '@/features/vocabulary';
import type { TargetLanguage } from '@/language';

export interface VocabularyBooksRepository {
  create: (params: CreateVocabularyBookParams) => Promise<VocabularyBookEntity>;
  findById: (bookId: string) => Promise<VocabularyBookEntity | null>;
  findByUserId: (userId: string, targetLanguage?: TargetLanguage) => Promise<VocabularyBookEntity[]>;
  update: (bookId: string, updates: UpdateVocabularyBookParams) => Promise<void>;
  delete: (bookId: string) => Promise<void>;
  addEntry: (bookId: string, entryId: string) => Promise<void>;
  deleteEntry: (bookId: string, entryId: string) => Promise<void>;
}
