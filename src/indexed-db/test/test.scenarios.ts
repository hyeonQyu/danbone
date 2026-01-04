import {
  cleanupTestDB,
  createTestIndexedDBStore,
  generateCommentData,
  generatePostData,
  generateSampleData,
  initTestDB,
  measurePerformance,
  runTest,
  SampleData,
  TestResult,
} from './test.utils';

/**
 * 테스트 시나리오 결과
 */
export interface ScenarioResult {
  scenario: string;
  tests: TestResult[];
  totalDuration: number;
  successCount: number;
  failureCount: number;
}

/**
 * CRUD 기본 테스트
 */
export async function testBasicCRUD(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Basic CRUD Tests ===\n');

  // Setup
  await cleanupTestDB();
  await initTestDB();

  // Test 1: Add
  tests.push(
    await runTest('Add single user', async () => {
      const store = createTestIndexedDBStore('users');
      const id = await store.add({
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        timestamp: Date.now(),
        category: 'A',
      });
      if (!id) throw new Error('Failed to add item');
    }),
  );

  // Test 2: Get
  tests.push(
    await runTest('Get user by ID', async () => {
      const store = createTestIndexedDBStore('users');
      const item = await store.get(1);
      if (!item || item.name !== 'Test User') throw new Error('Failed to get item');
    }),
  );

  // Test 3: Update
  tests.push(
    await runTest('Update user', async () => {
      const store = createTestIndexedDBStore('users');
      await store.update(1, {
        name: 'Updated User',
        email: 'test@example.com',
        age: 26,
        timestamp: Date.now(),
        category: 'B',
      });
      const item = await store.get(1);
      if (!item || item.name !== 'Updated User') throw new Error('Failed to update item');
    }),
  );

  // Test 4: Delete
  tests.push(
    await runTest('Delete user', async () => {
      const store = createTestIndexedDBStore('users');
      await store.delete(1);
      const item = await store.get(1);
      if (item !== undefined) throw new Error('Failed to delete item');
    }),
  );

  // Test 5: Count
  tests.push(
    await runTest('Count users', async () => {
      const store = createTestIndexedDBStore('users');
      const count = await store.count();
      if (count !== 0) throw new Error(`Expected 0 items, got ${count}`);
    }),
  );

  // Cleanup
  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Basic CRUD',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * 멀티 스토어 테스트 (users, posts, comments)
 */
export async function testMultiStore(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Multi Store Tests ===\n');

  await cleanupTestDB();
  await initTestDB();

  // Test 1: Add users
  let userIds: IDBValidKey[] = [];
  tests.push(
    await runTest('Add 5 users', async () => {
      const userStore = createTestIndexedDBStore('users');
      const users = generateSampleData(5);
      userIds = await userStore.bulkAdd(users);
      if (userIds.length !== 5) throw new Error(`Expected 5 users, got ${userIds.length}`);
    }),
  );

  // Test 2: Add posts
  let postIds: IDBValidKey[] = [];
  tests.push(
    await runTest('Add 10 posts', async () => {
      const postStore = createTestIndexedDBStore('posts');
      const posts = generatePostData(10, userIds as number[]);
      postIds = await postStore.bulkAdd(posts);
      if (postIds.length !== 10) throw new Error(`Expected 10 posts, got ${postIds.length}`);
    }),
  );

  // Test 3: Add comments
  tests.push(
    await runTest('Add 20 comments', async () => {
      const commentStore = createTestIndexedDBStore('comments');
      const comments = generateCommentData(20, postIds as number[], userIds as number[]);
      const commentIds = await commentStore.bulkAdd(comments);
      if (commentIds.length !== 20) throw new Error(`Expected 20 comments, got ${commentIds.length}`);
    }),
  );

  // Test 4: Get posts by userId
  tests.push(
    await runTest('Get posts by userId index', async () => {
      const postStore = createTestIndexedDBStore('posts');
      const posts = await postStore.getAllByIndex('userId', userIds[0]);
      if (posts.length === 0) throw new Error('Failed to get posts by userId');
    }),
  );

  // Test 5: Get comments by postId
  tests.push(
    await runTest('Get comments by postId index', async () => {
      const commentStore = createTestIndexedDBStore('comments');
      const comments = await commentStore.getAllByIndex('postId', postIds[0]);
      if (comments.length === 0) throw new Error('Failed to get comments by postId');
    }),
  );

  // Test 6: Count all stores
  tests.push(
    await runTest('Count all stores', async () => {
      const userStore = createTestIndexedDBStore('users');
      const postStore = createTestIndexedDBStore('posts');
      const commentStore = createTestIndexedDBStore('comments');

      const userCount = await userStore.count();
      const postCount = await postStore.count();
      const commentCount = await commentStore.count();

      if (userCount !== 5) throw new Error(`Expected 5 users, got ${userCount}`);
      if (postCount !== 10) throw new Error(`Expected 10 posts, got ${postCount}`);
      if (commentCount !== 20) throw new Error(`Expected 20 comments, got ${commentCount}`);
    }),
  );

  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Multi Store',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * 대량 작업 테스트
 */
export async function testBulkOperations(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Bulk Operations Tests ===\n');

  await cleanupTestDB();
  await initTestDB();

  // Test 1: Bulk Add
  tests.push(
    await runTest('Bulk add 100 users', async () => {
      const store = createTestIndexedDBStore('users');
      const data = generateSampleData(100);
      const ids = await store.bulkAdd(data);
      if (ids.length !== 100) throw new Error(`Expected 100 IDs, got ${ids.length}`);
    }),
  );

  // Test 2: Get All
  tests.push(
    await runTest('Get all users', async () => {
      const store = createTestIndexedDBStore('users');
      const items = await store.getAll();
      if (items.length !== 100) throw new Error(`Expected 100 items, got ${items.length}`);
    }),
  );

  // Test 3: Bulk Delete
  tests.push(
    await runTest('Bulk delete 50 users', async () => {
      const store = createTestIndexedDBStore('users');
      const idsToDelete = Array.from({ length: 50 }, (_, i) => i + 1);
      await store.bulkDelete(idsToDelete);
      const count = await store.count();
      if (count !== 50) throw new Error(`Expected 50 items remaining, got ${count}`);
    }),
  );

  // Test 4: Clear
  tests.push(
    await runTest('Clear all users', async () => {
      const store = createTestIndexedDBStore('users');
      await store.clear();
      const count = await store.count();
      if (count !== 0) throw new Error(`Expected 0 items, got ${count}`);
    }),
  );

  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Bulk Operations',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * 인덱스 검색 테스트
 */
export async function testIndexQueries(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Index Queries Tests ===\n');

  await cleanupTestDB();
  await initTestDB();

  // Setup data
  const store = createTestIndexedDBStore('users');
  const data = generateSampleData(50);
  await store.bulkAdd(data);

  // Test 1: Find by email index
  tests.push(
    await runTest('Find by email index', async () => {
      const store = createTestIndexedDBStore('users');
      const item = await store.getByIndex('email', 'user0@test.com');
      if (!item || item.email !== 'user0@test.com') throw new Error('Failed to find by email index');
    }),
  );

  // Test 2: Get all by category
  tests.push(
    await runTest('Get all by category index', async () => {
      const store = createTestIndexedDBStore('users');
      const items = await store.getAllByIndex('category', 'A');
      if (items.length === 0) throw new Error('Failed to get items by category index');
    }),
  );

  // Test 3: Get all by age range
  tests.push(
    await runTest('Get users in age range', async () => {
      const store = createTestIndexedDBStore('users');
      const items = await store.getRange(25, 35);
      if (items.length === 0) throw new Error('Failed to get items in range');
    }),
  );

  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Index Queries',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * 페이지네이션 테스트
 */
export async function testPagination(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Pagination Tests ===\n');

  await cleanupTestDB();
  await initTestDB();

  // Setup data
  const store = createTestIndexedDBStore('users');
  const data = generateSampleData(100);
  await store.bulkAdd(data);

  // Test 1: First page
  tests.push(
    await runTest('Get first page (10 items)', async () => {
      const store = createTestIndexedDBStore('users');
      const result = await store.getPaginated({ offset: 0, limit: 10 });
      if (result.data.length !== 10) throw new Error(`Expected 10 items, got ${result.data.length}`);
      if (result.total !== 100) throw new Error(`Expected total 100, got ${result.total}`);
      if (!result.hasMore) throw new Error('Expected hasMore to be true');
    }),
  );

  // Test 2: Second page
  tests.push(
    await runTest('Get second page (10 items)', async () => {
      const store = createTestIndexedDBStore('users');
      const result = await store.getPaginated({ offset: 10, limit: 10 });
      if (result.data.length !== 10) throw new Error(`Expected 10 items, got ${result.data.length}`);
    }),
  );

  // Test 3: Last page
  tests.push(
    await runTest('Get last page', async () => {
      const store = createTestIndexedDBStore('users');
      const result = await store.getPaginated({ offset: 90, limit: 10 });
      if (result.data.length !== 10) throw new Error(`Expected 10 items, got ${result.data.length}`);
      if (result.hasMore) throw new Error('Expected hasMore to be false');
    }),
  );

  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Pagination',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * Zod 검증 테스트
 */
export async function testZodValidation(): Promise<ScenarioResult> {
  const tests: TestResult[] = [];
  const startTime = performance.now();

  console.log('\n=== Zod Validation Tests ===\n');

  await cleanupTestDB();
  await initTestDB();

  // Test 1: Valid data
  tests.push(
    await runTest('Add valid user', async () => {
      const store = createTestIndexedDBStore('users');
      await store.add({
        name: 'Valid User',
        email: 'valid@example.com',
        age: 30,
        timestamp: Date.now(),
        category: 'A',
      });
    }),
  );

  // Test 2: Invalid email
  tests.push(
    await runTest('Reject invalid email', async () => {
      const store = createTestIndexedDBStore('users');
      try {
        await store.add({
          name: 'Invalid User',
          email: 'not-an-email',
          age: 30,
          timestamp: Date.now(),
          category: 'A',
        });
        throw new Error('Should have rejected invalid email');
      } catch (error) {
        if (!(error as Error).message.includes('Validation failed')) {
          throw error;
        }
      }
    }),
  );

  // Test 3: Invalid age (negative)
  tests.push(
    await runTest('Reject invalid age', async () => {
      const store = createTestIndexedDBStore('users');
      try {
        await store.add({
          name: 'Invalid User',
          email: 'test@example.com',
          age: -5,
          timestamp: Date.now(),
          category: 'A',
        });
        throw new Error('Should have rejected negative age');
      } catch (error) {
        if (!(error as Error).message.includes('Validation failed')) {
          throw error;
        }
      }
    }),
  );

  // Test 4: Invalid category
  tests.push(
    await runTest('Reject invalid category', async () => {
      const store = createTestIndexedDBStore('users');
      try {
        await store.add({
          name: 'Invalid User',
          email: 'test@example.com',
          age: 30,
          timestamp: Date.now(),
          category: 'Z' as 'A' | 'B' | 'C' | 'D', // Invalid category (type cast to bypass TS)
        });
        throw new Error('Should have rejected invalid category');
      } catch (error) {
        if (!(error as Error).message.includes('Validation failed')) {
          throw error;
        }
      }
    }),
  );

  await cleanupTestDB();

  const totalDuration = performance.now() - startTime;
  const successCount = tests.filter((t) => t.success).length;
  const failureCount = tests.filter((t) => !t.success).length;

  return {
    scenario: 'Zod Validation',
    tests,
    totalDuration,
    successCount,
    failureCount,
  };
}

/**
 * 성능 벤치마크
 */
export async function runPerformanceBenchmark(): Promise<{
  results: Array<{ operation: string; duration: number; formatted: string }>;
}> {
  console.log('\n=== Performance Benchmark ===\n');

  await cleanupTestDB();
  await initTestDB();

  const results: Array<{ operation: string; duration: number; formatted: string }> = [];

  // Benchmark 1: Add 1000 items
  const { duration: addDuration, formatted: addFormatted } = await measurePerformance('Add 1000 users', async () => {
    const store = createTestIndexedDBStore('users');
    const data = generateSampleData(1000);
    await store.bulkAdd(data);
  });
  results.push({ operation: 'Add 1000 users', duration: addDuration, formatted: addFormatted });

  // Benchmark 2: Get all 1000 items
  const { duration: getAllDuration, formatted: getAllFormatted } = await measurePerformance('Get all 1000 users', async () => {
    const store = createTestIndexedDBStore('users');
    await store.getAll();
  });
  results.push({ operation: 'Get all 1000 users', duration: getAllDuration, formatted: getAllFormatted });

  // Benchmark 3: Find by index
  const { duration: findDuration, formatted: findFormatted } = await measurePerformance('Find by email index', async () => {
    const store = createTestIndexedDBStore('users');
    await store.getByIndex('email', 'user500@test.com');
  });
  results.push({ operation: 'Find by email index', duration: findDuration, formatted: findFormatted });

  // Benchmark 4: Filter with predicate
  const { duration: filterDuration, formatted: filterFormatted } = await measurePerformance('Filter users (age > 40)', async () => {
    const store = createTestIndexedDBStore('users');
    await store.filter((item: SampleData) => item.age > 40);
  });
  results.push({ operation: 'Filter users (age > 40)', duration: filterDuration, formatted: filterFormatted });

  // Benchmark 5: Delete all
  const { duration: clearDuration, formatted: clearFormatted } = await measurePerformance('Clear all users', async () => {
    const store = createTestIndexedDBStore('users');
    await store.clear();
  });
  results.push({ operation: 'Clear all users', duration: clearDuration, formatted: clearFormatted });

  await cleanupTestDB();

  return { results };
}

/**
 * 모든 테스트 실행
 */
export async function runAllTests(): Promise<{
  scenarios: ScenarioResult[];
  totalTests: number;
  totalSuccess: number;
  totalFailures: number;
}> {
  const scenarios: ScenarioResult[] = [];

  scenarios.push(await testBasicCRUD());
  scenarios.push(await testMultiStore());
  scenarios.push(await testBulkOperations());
  scenarios.push(await testIndexQueries());
  scenarios.push(await testPagination());
  scenarios.push(await testZodValidation());

  const totalTests = scenarios.reduce((sum, s) => sum + s.tests.length, 0);
  const totalSuccess = scenarios.reduce((sum, s) => sum + s.successCount, 0);
  const totalFailures = scenarios.reduce((sum, s) => sum + s.failureCount, 0);

  return {
    scenarios,
    totalTests,
    totalSuccess,
    totalFailures,
  };
}
