import { JmdictServerService, JmdictServerServiceDependencies } from '@/data/server/services/jmdict/server.jmdict.service.types';
import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import { JmdictEntity } from '@/features/dictionary/jmdict.entity';
import { JmdictEntry, JmdictEntrySchema } from '@/features/dictionary/jmdict.types';
import { Timestamp } from 'firebase-admin/firestore';

const BATCH_SIZE = 4000; // 하루 저장 개수 (무료 플랜 제한 고려)

export const createJmdictServerService = getServerServiceCreator<JmdictServerService, JmdictServerServiceDependencies>(
  ({ jmdictRepository }) => {
    return {
      saveNextBatch: async (allEntries: JmdictEntry[]) => {
        const startTime = Date.now();

        // 1. 현재 저장된 개수 조회
        const storedCount = await jmdictRepository.getStoredCount();

        // 2. 완료 여부 확인
        if (storedCount >= allEntries.length) {
          return {
            savedEntries: 0,
            savedIndexes: 0,
            totalStored: storedCount,
            isComplete: true,
            duration: Date.now() - startTime,
          };
        }

        // 3. 다음 배치 추출
        const nextBatch = allEntries.slice(storedCount, storedCount + BATCH_SIZE);

        // 4. 데이터 검증
        const validatedBatch = nextBatch.map((entry) => JmdictEntrySchema.parse(entry));

        // 5. JmdictEntry[] → JmdictEntity[] 변환
        const now = Timestamp.now().toDate();
        const entities: JmdictEntity[] = validatedBatch.map((entry) => ({
          ...entry,
          createdAt: now,
          updatedAt: now,
        }));

        // 6. Repository를 통해 저장
        const result = await jmdictRepository.saveEntries(entities);

        // 7. 결과 반환
        const totalStored = storedCount + result.savedEntries;
        const isComplete = totalStored >= allEntries.length;
        const duration = Date.now() - startTime;

        console.log(`✅ JMdict 저장 완료: ${result.savedEntries} entries, ${result.savedIndexes} indexes (${duration}ms)`);
        console.log(`📊 진행률: ${totalStored} / ${allEntries.length} (${Math.round((totalStored / allEntries.length) * 100)}%)`);

        return {
          savedEntries: result.savedEntries,
          savedIndexes: result.savedIndexes,
          totalStored,
          isComplete,
          duration,
        };
      },
    };
  },
);
