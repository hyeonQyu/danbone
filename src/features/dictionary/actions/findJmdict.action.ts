'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { InvalidValueError } from '@/errors';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { convertJmdictEntityToDictionaryEntry } from '@/features/dictionary/dictionary.utils';

/**
 * 테스트용
 * @deprecated
 * @param id
 * @returns
 */
export const findJmdictById = async (id: string) => {
  if (!id || typeof id !== 'string') {
    throw new InvalidValueError('유효하지 않은 ID입니다.');
  }

  return await jmdictServiceServer.findById(id);
};

/**
 * 테스트용
 * @deprecated
 */
export const findJmdictByTerm = jmdictServiceServer.findByTerm;

interface GetDictionaryEntryJAParams {
  entryId: string;
  sourceLanguage: string;
}

export const getDictionaryEntryJA = async ({
  entryId,
  sourceLanguage,
}: GetDictionaryEntryJAParams): Promise<DictionaryEntryByLanguage['ja'] | null> => {
  if (!entryId || typeof entryId !== 'string') {
    throw new InvalidValueError('유효하지 않은 ID입니다.');
  }

  const jmdictEntry = await jmdictServiceServer.findById(entryId);

  if (!jmdictEntry) {
    return null;
  }

  return convertJmdictEntityToDictionaryEntry(jmdictEntry, sourceLanguage);
};
