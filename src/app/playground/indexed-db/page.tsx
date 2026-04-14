'use client';

import {
  cleanupTestDB,
  createTestIndexedDBStore,
  generateSampleData,
  initTestDB,
  runAllTests,
  runPerformanceBenchmark,
  ScenarioResult,
  testBasicCRUD,
  testBulkOperations,
  testIndexQueries,
  testMultiStore,
  testPagination,
  testZodValidation,
} from '@/indexed-db/test';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, PlayArrow as PlayArrowIcon, Speed as SpeedIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';

type TestStatus = 'idle' | 'running' | 'completed' | 'error';

export default function IndexedDBPlaygroundPage() {
  const [tabValue, setTabValue] = useState(0);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [benchmarkResults, setBenchmarkResults] = useState<Array<{ operation: string; duration: number; formatted: string }>>([]);
  const [summary, setSummary] = useState<{ totalTests: number; totalSuccess: number; totalFailures: number } | null>(null);
  const [crudResult, setCrudResult] = useState<string>('');

  const handleRunAllTests = async () => {
    setTestStatus('running');
    setScenarios([]);
    setSummary(null);

    try {
      const result = await runAllTests();
      setScenarios(result.scenarios);
      setSummary({
        totalTests: result.totalTests,
        totalSuccess: result.totalSuccess,
        totalFailures: result.totalFailures,
      });
      setTestStatus('completed');
    } catch (error) {
      console.error('Tests failed:', error);
      setTestStatus('error');
    }
  };

  const handleRunSingleTest = async (testFn: () => Promise<ScenarioResult>) => {
    setTestStatus('running');
    setScenarios([]);
    setSummary(null);

    try {
      const result = await testFn();
      setScenarios([result]);
      setSummary({
        totalTests: result.tests.length,
        totalSuccess: result.successCount,
        totalFailures: result.failureCount,
      });
      setTestStatus('completed');
    } catch (error) {
      console.error('Test failed:', error);
      setTestStatus('error');
    }
  };

  const handleRunBenchmark = async () => {
    setTestStatus('running');
    setBenchmarkResults([]);

    try {
      const result = await runPerformanceBenchmark();
      setBenchmarkResults(result.results);
      setTestStatus('completed');
    } catch (error) {
      console.error('Benchmark failed:', error);
      setTestStatus('error');
    }
  };

  const handleCrudOperation = async (operation: string, fn: () => Promise<void>) => {
    setTestStatus('running');
    setCrudResult('');
    try {
      await fn();
      setCrudResult(`✅ ${operation} 성공! 개발자 도구의 Application > IndexedDB > TestDB를 확인하세요.`);
      setTestStatus('completed');
    } catch (error) {
      console.error(`${operation} failed:`, error);
      setCrudResult(`❌ ${operation} 실패: ${(error as Error).message}`);
      setTestStatus('error');
    }
  };

  const handleInitDB = () =>
    handleCrudOperation('DB 초기화', async () => {
      await cleanupTestDB();
      await initTestDB();
    });

  const handleAddUser = () =>
    handleCrudOperation('사용자 추가', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      const id = await store.add({
        name: 'Test User',
        email: 'test@example.com',
        age: 25,
        timestamp: Date.now(),
        category: 'A',
      });
      console.log('Added user with ID:', id);
    });

  const handleGetUser = () =>
    handleCrudOperation('사용자 조회', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      const item = await store.get(1);
      console.log('Retrieved user:', item);
      if (!item) throw new Error('사용자를 찾을 수 없습니다. 먼저 사용자를 추가하세요.');
    });

  const handleUpdateUser = () =>
    handleCrudOperation('사용자 수정', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      await store.update(1, {
        name: 'Updated User',
        email: 'updated@example.com',
        age: 26,
        timestamp: Date.now(),
        category: 'B',
      });
      const item = await store.get(1);
      console.log('Updated user:', item);
    });

  const handleDeleteUser = () =>
    handleCrudOperation('사용자 삭제', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      await store.delete(1);
      console.log('Deleted user with ID: 1');
    });

  const handleGetAllUsers = () =>
    handleCrudOperation('모든 사용자 조회', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      const items = await store.getAll();
      console.log('All users:', items);
      console.log('Total count:', items.length);
    });

  const handleAddMultipleUsers = () =>
    handleCrudOperation('여러 사용자 추가', async () => {
      await initTestDB();
      const store = createTestIndexedDBStore('users');
      const users = generateSampleData(5);
      const ids = await store.bulkAdd(users);
      console.log('Added users with IDs:', ids);
    });

  const handleCleanup = () =>
    handleCrudOperation('DB 정리', async () => {
      await cleanupTestDB();
    });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          IndexedDB Playground
        </Typography>
        <Typography variant="body1" color="text.secondary">
          IndexedDB 기반 로직 테스트 및 성능 벤치마크
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="개별 CRUD 테스트" />
          <Tab label="자동 테스트 실행" />
          <Tab label="성능 벤치마크" />
        </Tabs>
      </Paper>

      {/* Tab 0: 개별 CRUD 테스트 */}
      {tabValue === 0 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                DB 초기화 및 정리
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                테스트를 시작하기 전에 DB를 초기화하거나, 테스트 후 정리할 수 있습니다.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleInitDB} disabled={testStatus === 'running'}>
                  DB 초기화
                </Button>
                <Button variant="outlined" color="error" onClick={handleCleanup} disabled={testStatus === 'running'}>
                  DB 정리
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                기본 CRUD 작업
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                각 버튼을 순서대로 클릭하여 개발자 도구에서 IndexedDB 변화를 확인하세요.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <Button variant="outlined" onClick={handleAddUser} disabled={testStatus === 'running'}>
                  1. 사용자 추가 (Add)
                </Button>
                <Button variant="outlined" onClick={handleGetUser} disabled={testStatus === 'running'}>
                  2. 사용자 조회 (Get)
                </Button>
                <Button variant="outlined" onClick={handleUpdateUser} disabled={testStatus === 'running'}>
                  3. 사용자 수정 (Update)
                </Button>
                <Button variant="outlined" onClick={handleDeleteUser} disabled={testStatus === 'running'}>
                  4. 사용자 삭제 (Delete)
                </Button>
                <Button variant="outlined" onClick={handleGetAllUsers} disabled={testStatus === 'running'}>
                  5. 전체 조회 (GetAll)
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                대량 작업
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="secondary" onClick={handleAddMultipleUsers} disabled={testStatus === 'running'}>
                  여러 사용자 추가 (5명)
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {testStatus === 'running' && (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              작업을 실행 중입니다...
            </Alert>
          )}

          {crudResult && testStatus === 'completed' && <Alert severity="success">{crudResult}</Alert>}

          {crudResult && testStatus === 'error' && <Alert severity="error">{crudResult}</Alert>}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 개발자 도구에서 확인하기
              </Typography>
              <Typography variant="body2" component="div">
                <ol>
                  <li>F12를 눌러 개발자 도구를 엽니다</li>
                  <li>Application 탭을 클릭합니다</li>
                  <li>좌측 메뉴에서 Storage → IndexedDB → TestDB → users를 선택합니다</li>
                  <li>각 버튼을 클릭할 때마다 데이터의 변화를 확인할 수 있습니다</li>
                  <li>Console 탭에서도 로그를 확인할 수 있습니다</li>
                </ol>
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Tab 1: 자동 테스트 실행 */}
      {tabValue === 1 && (
        <Stack spacing={3}>
          {/* 컨트롤 버튼 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                테스트 실행
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 1 }}>
                <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleRunAllTests} disabled={testStatus === 'running'}>
                  모든 테스트 실행
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testBasicCRUD)} disabled={testStatus === 'running'}>
                  Basic CRUD
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testMultiStore)} disabled={testStatus === 'running'}>
                  Multi Store
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testBulkOperations)} disabled={testStatus === 'running'}>
                  Bulk Operations
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testIndexQueries)} disabled={testStatus === 'running'}>
                  Index Queries
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testPagination)} disabled={testStatus === 'running'}>
                  Pagination
                </Button>
                <Button variant="outlined" onClick={() => handleRunSingleTest(testZodValidation)} disabled={testStatus === 'running'}>
                  Zod Validation
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* 로딩 인디케이터 */}
          {testStatus === 'running' && (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              테스트를 실행 중입니다...
            </Alert>
          )}

          {/* 에러 표시 */}
          {testStatus === 'error' && <Alert severity="error">테스트 실행 중 오류가 발생했습니다. 콘솔을 확인해주세요.</Alert>}

          {/* 요약 */}
          {summary && testStatus === 'completed' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  테스트 요약
                </Typography>
                <Stack direction="row" spacing={3}>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {summary.totalTests}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      전체 테스트
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {summary.totalSuccess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      성공
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" color="error.main">
                      {summary.totalFailures}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      실패
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(summary.totalSuccess / summary.totalTests) * 100}
                    color={summary.totalFailures === 0 ? 'success' : 'warning'}
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* 시나리오별 결과 */}
          {scenarios.map((scenario, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{scenario.scenario}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`${scenario.successCount} 성공`} color="success" size="small" icon={<CheckCircleIcon />} />
                    {scenario.failureCount > 0 && (
                      <Chip label={`${scenario.failureCount} 실패`} color="error" size="small" icon={<ErrorIcon />} />
                    )}
                    <Chip label={`${scenario.totalDuration.toFixed(2)}ms`} size="small" variant="outlined" />
                  </Stack>
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>상태</TableCell>
                        <TableCell>테스트</TableCell>
                        <TableCell align="right">소요 시간</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scenario.tests.map((test, testIndex) => (
                        <TableRow key={testIndex}>
                          <TableCell>
                            {test.success ? (
                              <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                              <ErrorIcon color="error" fontSize="small" />
                            )}
                          </TableCell>
                          <TableCell>
                            {test.message}
                            {test.error && (
                              <Typography variant="caption" color="error" display="block">
                                {test.error.message}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{test.duration !== undefined ? `${test.duration.toFixed(2)}ms` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Tab 2: 성능 벤치마크 */}
      {tabValue === 2 && (
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                성능 벤치마크 실행
              </Typography>
              <Button variant="contained" startIcon={<SpeedIcon />} onClick={handleRunBenchmark} disabled={testStatus === 'running'}>
                벤치마크 실행
              </Button>
            </CardContent>
          </Card>

          {testStatus === 'running' && (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              벤치마크를 실행 중입니다...
            </Alert>
          )}

          {testStatus === 'error' && <Alert severity="error">벤치마크 실행 중 오류가 발생했습니다. 콘솔을 확인해주세요.</Alert>}

          {benchmarkResults.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  벤치마크 결과
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>작업</TableCell>
                        <TableCell align="right">소요 시간</TableCell>
                        <TableCell align="right">성능</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {benchmarkResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.operation}</TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="bold">
                              {result.formatted}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={result.duration < 100 ? '매우 빠름' : result.duration < 500 ? '빠름' : '보통'}
                              color={result.duration < 100 ? 'success' : result.duration < 500 ? 'primary' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}

          {benchmarkResults.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  분석
                </Typography>
                <Stack spacing={2}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>총 작업 수:</strong> {benchmarkResults.length}
                    </Typography>
                  </Alert>
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>가장 빠른 작업:</strong>{' '}
                      {benchmarkResults.reduce((min, r) => (r.duration < min.duration ? r : min)).operation} (
                      {benchmarkResults.reduce((min, r) => (r.duration < min.duration ? r : min)).formatted})
                    </Typography>
                  </Alert>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      <strong>가장 느린 작업:</strong>{' '}
                      {benchmarkResults.reduce((max, r) => (r.duration > max.duration ? r : max)).operation} (
                      {benchmarkResults.reduce((max, r) => (r.duration > max.duration ? r : max)).formatted})
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </Container>
  );
}
