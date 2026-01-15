import { JmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdictEntries.repository.types';
import { VocabularyBooksRepository, VocabularyLearningRepository } from '@/data/server/repositories/vocabulary';
import {
  CreateVocabularyBookParams,
  UpdateVocabularyBookParams,
  UpdateVocabularyLearningParams,
  VocabularyBookEntity,
  VocabularyEntryWithLearning,
} from '@/features/vocabulary';
import { TargetLanguage } from '@/language';

export interface VocabularyServerServiceDependencies {
  vocabularyBooksRepository: VocabularyBooksRepository;
  vocabularyLearningRepository: VocabularyLearningRepository;
  jmdictEntriesRepository: JmdictEntriesRepository;
}

export interface VocabularyServerService {
  createBook: (params: CreateVocabularyBookParams) => Promise<VocabularyBookEntity>;
  getBookById: (bookId: string) => Promise<VocabularyBookEntity | null>;
  getBooksByUserId: (params: { userId: string; targetLanguage?: TargetLanguage }) => Promise<VocabularyBookEntity[]>;
  updateBook: (params: { bookId: string; updates: UpdateVocabularyBookParams }) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;

  addEntryToBook: (params: { bookId: string; entryId: string; userId: string }) => Promise<void>;
  deleteEntryFromBook: (params: { bookId: string; entryId: string; userId: string }) => Promise<void>;
  getBookWithDetails: <T extends { id: string }>(params: {
    bookId: string;
    userId: string;
  }) => Promise<{
    book: VocabularyBookEntity;
    entries: VocabularyEntryWithLearning<T>[];
  }>;

  updateLearningData: (params: {
    userId: string;
    targetLanguage: TargetLanguage;
    entryId: string;
    updates: UpdateVocabularyLearningParams;
  }) => Promise<void>;
  reviewEntry: (params: { userId: string; targetLanguage: TargetLanguage; entryId: string; success: boolean }) => Promise<void>;
}
