'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { FindByTermParams } from '@/data/server/services/jmdict';
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
export const findJmdictByTerm = async (params: FindByTermParams) => {
  const entries = await jmdictServiceServer.findByTerm(params);
  if (!entries) {
    return null;
  }
  // TODO: DAN-98 에서 수정
  return entries.map((entry) => convertJmdictEntityToDictionaryEntry(entry, 'eng'));
};

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

  // TODO: DAN-98 에서 수정
  return convertJmdictEntityToDictionaryEntry(jmdictEntry, 'eng');
};
