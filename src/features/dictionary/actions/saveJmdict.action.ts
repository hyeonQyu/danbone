'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';

export const getJmdictProgress = async () => {
  try {
    const storedCount = await jmdictServiceServer.getStoredCount();

    return {
      success: true,
      data: { startIndex: storedCount },
    };
  } catch (error) {
    console.error('❌ JMdict 진행 상태 조회 실패:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : '진행 상태 조회 실패',
    };
  }
};

export const saveJmdictBatch = async (batch: JmdictEntry[]) => {
  try {
    if (!Array.isArray(batch) || batch.length === 0) {
      throw new Error('배치가 비어있습니다.');
    }

    JmdictEntrySchema.parse(batch[0]);

    const result = await jmdictServiceServer.saveEntries(batch);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ JMdict 저장 실패:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
};
