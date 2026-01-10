'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { InvalidValueError } from '@/errors';

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
