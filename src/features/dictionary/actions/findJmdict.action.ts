'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { InvalidValueError } from '@/errors';
import { JmdictTermType } from '@/features/dictionary';

export const findJmdictById = async (id: string) => {
  if (!id || typeof id !== 'string') {
    throw new InvalidValueError('유효하지 않은 ID입니다.');
  }

  return await jmdictServiceServer.findById(id);
};

export const findJmdictByTerm = async (searchTerm: string, termType: JmdictTermType) => {
  if (!searchTerm || typeof searchTerm !== 'string') {
    throw new Error('유효하지 않은 검색어입니다.');
  }

  if (termType !== 'kanji' && termType !== 'kana') {
    throw new Error('유효하지 않은 검색 타입입니다. (kanji 또는 kana)');
  }

  return await jmdictServiceServer.findByTerm({ searchTerm, termType });
};
