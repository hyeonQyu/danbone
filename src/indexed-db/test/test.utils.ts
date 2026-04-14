import { createIndexedDBConfig, deleteIndexedDB, ExtractStoreMap, StoreAPI } from '@/indexed-db';
import { createIndexedDBStore } from '@/indexed-db/utils/store.utils';
import { IDBPDatabase, openDB } from 'idb';
import { z } from 'zod';

/**
 * Zod 스키마 정의
 */
export const sampleDataSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  timestamp: z.number(),
  category: z.enum(['A', 'B', 'C', 'D']),
});

export const postSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  title: z.string().min(1).max(200),
  content: z.string(),
  createdAt: z.number(),
});

export const commentSchema = z.object({
  id: z.number().optional(),
  postId: z.number(),
  userId: z.number(),
  text: z.string().min(1).max(500),
  createdAt: z.number(),
});

/**
 * 타입 자동 추출
 */
export type SampleData = z.infer<typeof sampleDataSchema>;
export type Post = z.infer<typeof postSchema>;
export type Comment = z.infer<typeof commentSchema>;

/**
 * 테스트용 DB 설정
 */
export const TEST_DB_CONFIG = createIndexedDBConfig({
  name: 'TestDB',
  version: 1,
  stores: [
    {
      name: 'users',
      schema: sampleDataSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'email', keyPath: 'email', options: { unique: true } },
        { name: 'age', keyPath: 'age', options: { unique: false } },
        { name: 'category', keyPath: 'category', options: { unique: false } },
        { name: 'timestamp', keyPath: 'timestamp', options: { unique: false } },
      ],
    },
    {
      name: 'posts',
      schema: postSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'userId', keyPath: 'userId', options: { unique: false } },
        { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
      ],
    },
    {
      name: 'comments',
      schema: commentSchema,
      keyPath: 'id',
      autoIncrement: true,
      indexes: [
        { name: 'postId', keyPath: 'postId', options: { unique: false } },
        { name: 'userId', keyPath: 'userId', options: { unique: false } },
        { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
      ],
    },
  ] as const,
});

export type TestStoreMap = ExtractStoreMap<typeof TEST_DB_CONFIG>;
export type TestStoreName = keyof TestStoreMap;

/**
 * 테스트용 DB 인스턴스 (싱글톤)
 */
let testDBInstance: IDBPDatabase | null = null;

/**
 * 테스트용 DB 초기화
 */
export const initTestDB = async (): Promise<IDBPDatabase> => {
  if (testDBInstance) {
    return testDBInstance;
  }

  testDBInstance = await openDB(TEST_DB_CONFIG.name, TEST_DB_CONFIG.version, {
    upgrade(db) {
      TEST_DB_CONFIG.stores.forEach((storeConfig) => {
        if (!db.objectStoreNames.contains(storeConfig.name)) {
          const objectStore = db.createObjectStore(storeConfig.name, {
            keyPath: storeConfig.keyPath,
            autoIncrement: storeConfig.autoIncrement,
          });

          if (storeConfig.indexes) {
            storeConfig.indexes.forEach((indexConfig) => {
              objectStore.createIndex(indexConfig.name, indexConfig.keyPath, indexConfig.options);
            });
          }
        }
      });
    },
  });

  return testDBInstance;
};

/**
 * 랜덤 샘플 데이터 생성
 */
export const generateSampleData = (count: number): Omit<SampleData, 'id'>[] => {
  const categories: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry'];

  return Array.from({ length: count }, (_, i) => ({
    name: names[i % names.length] + i,
    email: `user${i}@test.com`,
    age: 20 + (i % 50),
    timestamp: Date.now() + i * 1000,
    category: categories[i % categories.length],
  }));
};

/**
 * 랜덤 포스트 데이터 생성
 */
export const generatePostData = (count: number, userIds: number[]): Omit<Post, 'id'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    userId: userIds[i % userIds.length],
    title: `Post Title ${i + 1}`,
    content: `This is the content of post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    createdAt: Date.now() + i * 1000,
  }));
};

/**
 * 랜덤 댓글 데이터 생성
 */
export const generateCommentData = (count: number, postIds: number[], userIds: number[]): Omit<Comment, 'id'>[] => {
  return Array.from({ length: count }, (_, i) => ({
    postId: postIds[i % postIds.length],
    userId: userIds[i % userIds.length],
    text: `Comment ${i + 1}: This is a test comment.`,
    createdAt: Date.now() + i * 1000,
  }));
};

/**
 * 테스트용 DB 삭제
 */
export const cleanupTestDB = async () => {
  if (testDBInstance) {
    testDBInstance.close();
    testDBInstance = null;
  }
  await deleteIndexedDB(TEST_DB_CONFIG.name);
};

/**
 * 테스트용 타입 안전한 Store 생성 함수
 * 주의: 사용 전에 initTestDB()를 먼저 호출해야 합니다
 */
export const createTestIndexedDBStore = <N extends TestStoreName>(
  storeName: N,
): StoreAPI<TestStoreMap[N]['data'], TestStoreMap[N]['key']> => {
  if (!testDBInstance) {
    throw new Error('Test DB not initialized. Call initTestDB() first.');
  }

  const storeConfig = TEST_DB_CONFIG.stores.find((s) => s.name === storeName);
  const schema = storeConfig?.schema as z.ZodType<TestStoreMap[N]['data']> | undefined;

  return createIndexedDBStore<TestStoreMap[N]['data'], TestStoreMap[N]['key']>(testDBInstance, storeName, schema);
};

/**
 * 성능 측정 유틸리티
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private endTime: number = 0;

  start = (): void => {
    this.startTime = performance.now();
  };

  end = (): number => {
    this.endTime = performance.now();
    return this.getDuration();
  };

  getDuration = (): number => this.endTime - this.startTime;

  format = (): string => {
    const duration = this.getDuration();
    if (duration < 1) {
      return `${(duration * 1000).toFixed(2)}μs`;
    } else if (duration < 1000) {
      return `${duration.toFixed(2)}ms`;
    } else {
      return `${(duration / 1000).toFixed(2)}s`;
    }
  };
}

/**
 * 성능 측정 래퍼
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number; formatted: string }> => {
  const timer = new PerformanceTimer();
  timer.start();

  const result = await fn();

  const duration = timer.end();
  const formatted = timer.format();

  console.log(`[Performance] ${name}: ${formatted}`);

  return { result, duration, formatted };
};

/**
 * 테스트 결과 타입
 */
export interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
  error?: Error;
}

/**
 * 테스트 실행 헬퍼
 */
export const runTest = async (name: string, testFn: () => Promise<void>): Promise<TestResult> => {
  const timer = new PerformanceTimer();

  try {
    timer.start();
    await testFn();
    const duration = timer.end();

    return {
      success: true,
      message: `✓ ${name}`,
      duration,
    };
  } catch (error) {
    const duration = timer.end();

    return {
      success: false,
      message: `✗ ${name}`,
      duration,
      error: error as Error,
    };
  }
};
