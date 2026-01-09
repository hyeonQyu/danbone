'use server';

import { jmdictServiceServer } from '@/data/server/server.container';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';

export const saveNextJmdictBatch = async (jsonData: unknown, batchSize: number) => {
  try {
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON 데이터는 배열이어야 합니다.');
    }

    const sampleEntry = jsonData[0];
    JmdictEntrySchema.parse(sampleEntry);

    const entries = jsonData as JmdictEntry[];

    const result = await jmdictServiceServer.saveNextBatch(entries, batchSize);

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
