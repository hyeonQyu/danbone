'use server';

import { withAuth } from '@/auth/server.auth.utils';
import { vocabularyServiceServer } from '@/data/server/server.container';
import { TargetLanguage } from '@/language';

export const getVocabularyBooks = async (targetLanguage: TargetLanguage) => {
  return withAuth(async (userId) => {
    return vocabularyServiceServer.getBooksByUserId({
      userId,
      targetLanguage,
    });
  });
};
