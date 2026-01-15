import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import {
  VocabularyServerService,
  VocabularyServerServiceDependencies,
} from '@/data/server/services/vocabulary/server.vocabulary.service.types';
import { NotFoundError } from '@/errors';
import { MAX_ENTRIES_PER_BOOK, VocabularyBookEntity, VocabularyEntryWithLearning, VocabularyLearningEntity } from '@/features/vocabulary';
import { TargetLanguage } from '@/language';

export const createVocabularyServerService = getServerServiceCreator<VocabularyServerService, VocabularyServerServiceDependencies>(
  ({ vocabularyBooksRepository, vocabularyLearningRepository, jmdictEntriesRepository }) => {
    const validateBookNotFull = (book: VocabularyBookEntity): void => {
      if (book.entryIds.length >= MAX_ENTRIES_PER_BOOK) {
        throw new Error(`단어장이 가득 찼습니다 (${MAX_ENTRIES_PER_BOOK}/${MAX_ENTRIES_PER_BOOK})`);
      }
    };

    const validateEntryNotDuplicate = (book: VocabularyBookEntity, entryId: string): void => {
      if (book.entryIds.includes(entryId)) {
        throw new Error('이미 추가된 항목입니다');
      }
    };

    const validateBookOwnership = (book: VocabularyBookEntity, userId: string): void => {
      if (book.userId !== userId) {
        throw new Error('권한이 없습니다');
      }
    };

    const validateDictionaryEntryExists = async (targetLanguage: TargetLanguage, entryId: string): Promise<void> => {
      const entry = await getDictionaryEntry(targetLanguage, entryId);
      if (!entry) {
        throw new Error('사전 항목을 찾을 수 없습니다');
      }
    };

    const getDictionaryEntry = async (targetLanguage: TargetLanguage, entryId: string) => {
      switch (targetLanguage) {
        case 'ja':
          return jmdictEntriesRepository.findById(entryId);
        default:
          throw new Error(`Unsupported language: ${targetLanguage}`);
      }
    };

    const getDictionaryEntries = async (targetLanguage: TargetLanguage, entryIds: string[]) => {
      switch (targetLanguage) {
        case 'ja':
          return jmdictEntriesRepository.findByIds(entryIds);
        default:
          throw new Error(`Unsupported language: ${targetLanguage}`);
      }
    };

    const mergeLearningDataWithDictionary = <T extends { id: string }>(
      entryIds: string[],
      learningDataList: VocabularyLearningEntity[],
      dictionaryEntries: T[],
    ): VocabularyEntryWithLearning<T>[] => {
      return entryIds.map((entryId) => {
        const learning = learningDataList.find((l) => l.entryId === entryId);
        const dictionaryEntry = dictionaryEntries.find(({ id }) => id === entryId);

        if (!learning) {
          throw new Error(`Learning data not found for entry: ${entryId}`);
        }

        if (!dictionaryEntry) {
          throw new Error(`Dictionary entry not found: ${entryId}`);
        }

        return {
          entryId,
          learning,
          dictionaryEntry,
        };
      });
    };

    const calculateMasteryLevel = (correctCount: number, reviewCount: number): number => {
      if (reviewCount === 0) return 0;

      const accuracy = correctCount / reviewCount;

      if (accuracy >= 0.9) return 5;
      if (accuracy >= 0.75) return 4;
      if (accuracy >= 0.6) return 3;
      if (accuracy >= 0.4) return 2;
      if (accuracy >= 0.2) return 1;
      return 0;
    };

    const ensureLearningDataExists = async (userId: string, targetLanguage: TargetLanguage, entryId: string): Promise<void> => {
      const existing = await vocabularyLearningRepository.findByEntry({
        userId,
        targetLanguage,
        entryId,
      });

      if (!existing) {
        await vocabularyLearningRepository.create({
          userId,
          targetLanguage,
          entryId,
        });
      }
    };

    return {
      createBook: async (params) => {
        return vocabularyBooksRepository.create(params);
      },

      getBookById: async (bookId) => {
        return vocabularyBooksRepository.findById(bookId);
      },

      getBooksByUserId: async ({ userId, targetLanguage }) => {
        return vocabularyBooksRepository.findByUserId(userId, targetLanguage);
      },

      updateBook: async ({ bookId, updates }) => {
        return vocabularyBooksRepository.update(bookId, updates);
      },

      deleteBook: async (bookId) => {
        return vocabularyBooksRepository.delete(bookId);
      },

      addEntryToBook: async ({ bookId, entryId, userId }) => {
        const book = await vocabularyBooksRepository.findById(bookId);

        if (!book) {
          throw new NotFoundError('단어장을 찾을 수 없습니다');
        }

        validateBookOwnership(book, userId);
        validateBookNotFull(book);
        validateEntryNotDuplicate(book, entryId);
        await validateDictionaryEntryExists(book.targetLanguage, entryId);

        await ensureLearningDataExists(userId, book.targetLanguage, entryId);
        await vocabularyBooksRepository.addEntry(bookId, entryId);
      },

      deleteEntryFromBook: async ({ bookId, entryId, userId }) => {
        const book = await vocabularyBooksRepository.findById(bookId);

        if (!book) {
          throw new NotFoundError('단어장을 찾을 수 없습니다');
        }

        validateBookOwnership(book, userId);
        await vocabularyBooksRepository.deleteEntry(bookId, entryId);
      },

      getBookWithDetails: async <T extends { id: string }>({ bookId, userId }: { bookId: string; userId: string }) => {
        const book = await vocabularyBooksRepository.findById(bookId);

        if (!book) {
          throw new NotFoundError('단어장을 찾을 수 없습니다');
        }

        validateBookOwnership(book, userId);

        if (book.entryIds.length === 0) {
          return {
            book,
            entries: [] as VocabularyEntryWithLearning<T>[],
          };
        }

        const [learningData, dictEntries] = await Promise.all([
          vocabularyLearningRepository.findByEntries({
            userId,
            targetLanguage: book.targetLanguage,
            entryIds: book.entryIds,
          }),
          getDictionaryEntries(book.targetLanguage, book.entryIds),
        ]);

        const entries = mergeLearningDataWithDictionary<T>(book.entryIds, learningData, dictEntries as unknown as T[]);

        return {
          book,
          entries,
        };
      },

      updateLearningData: async (params) => {
        return vocabularyLearningRepository.update(params);
      },

      reviewEntry: async ({ userId, targetLanguage, entryId, success }) => {
        const learning = await vocabularyLearningRepository.findByEntry({
          userId,
          targetLanguage,
          entryId,
        });

        if (!learning) {
          throw new NotFoundError('학습 데이터를 찾을 수 없습니다');
        }

        const newReviewCount = learning.reviewCount + 1;
        const newCorrectCount = success ? learning.correctCount + 1 : learning.correctCount;
        const newMasteryLevel = calculateMasteryLevel(newCorrectCount, newReviewCount);

        await vocabularyLearningRepository.update({
          userId,
          targetLanguage,
          entryId,
          updates: {
            reviewCount: newReviewCount,
            correctCount: newCorrectCount,
            masteryLevel: newMasteryLevel,
            lastReviewedAt: new Date(),
          },
        });
      },
    };
  },
);
