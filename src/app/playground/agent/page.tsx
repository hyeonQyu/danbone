'use client';

import { TextModel } from '@/openai/model.types';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { evaluateAgentAction, getSupportedConfigurations, getTestCases, testUsageAction, type AgentName } from './actions';

const AGENT_OPTIONS = [
  { value: 'queryNormalizer', label: 'Query Normalizer', description: '쿼리 정규화' },
  { value: 'inputValidator', label: 'Input Validator', description: '입력 검증' },
  { value: 'translator', label: 'Translator', description: '번역' },
  { value: 'morphAnalyzer', label: 'Japanese Morph Analyzer', description: '일본어 형태소 분석' },
  { value: 'dictionaryJa', label: 'Japanese Dictionary', description: '일본어 사전' },
] as const;

const MODEL_OPTIONS: { value: TextModel; label: string; category: string }[] = [
  // GPT-5 시리즈
  { value: 'gpt-5.1', label: 'GPT-5.1', category: 'GPT-5' },
  { value: 'gpt-5', label: 'GPT-5', category: 'GPT-5' },
  { value: 'gpt-5-mini', label: 'GPT-5 Mini', category: 'GPT-5' },
  { value: 'gpt-5-nano', label: 'GPT-5 Nano', category: 'GPT-5' },
  { value: 'gpt-5-pro', label: 'GPT-5 Pro', category: 'GPT-5' },

  // GPT-4 시리즈
  { value: 'gpt-4.1', label: 'GPT-4.1', category: 'GPT-4' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', category: 'GPT-4' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano', category: 'GPT-4' },
  { value: 'gpt-4o', label: 'GPT-4o', category: 'GPT-4' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', category: 'GPT-4' },

  // O-시리즈
  { value: 'o1', label: 'O1', category: 'O-series' },
  { value: 'o1-mini', label: 'O1 Mini', category: 'O-series' },
  { value: 'o3', label: 'O3', category: 'O-series' },
  { value: 'o3-mini', label: 'O3 Mini', category: 'O-series' },
  { value: 'o4-mini', label: 'O4 Mini', category: 'O-series' },
];

export default function TestUsagePage() {
  const [mode, setMode] = useState<'single' | 'evaluate'>('single');
  const [input, setInput] = useState('안녕하세요. 저는 대한민국 사람입니다.');
  const [selectedAgent, setSelectedAgent] = useState<AgentName>('queryNormalizer');
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);
  const [supportedConfigurations, setSupportedConfigurations] = useState<Array<{ id: string; label?: string; model: TextModel }>>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Awaited<ReturnType<typeof testUsageAction>> | null>(null);
  const [evalResults, setEvalResults] = useState<Awaited<ReturnType<typeof evaluateAgentAction>> | null>(null);
  const [testCases, setTestCases] = useState<unknown[]>([]);

  // 필터 상태
  const [filterModels, setFilterModels] = useState<TextModel[]>([]);
  const [filterResult, setFilterResult] = useState<'all' | 'passed' | 'failed'>('all');

  // 에이전트가 변경되면 지원하는 configuration 목록과 테스트 케이스를 가져옴
  useEffect(() => {
    const loadData = async () => {
      const configs = await getSupportedConfigurations(selectedAgent);
      setSupportedConfigurations(configs);
      // 기존 선택된 configuration 중 지원하지 않는 것은 제거
      const configIds = configs.map((c) => c.id);
      setSelectedConfigs((prev) => prev.filter((id) => configIds.includes(id)));

      const cases = await getTestCases(selectedAgent);
      setTestCases(cases);
    };
    loadData();
  }, [selectedAgent]);

  const toggleConfig = (configId: string) => {
    setSelectedConfigs((prev) => {
      if (prev.includes(configId)) {
        return prev.filter((id) => id !== configId);
      } else {
        return [...prev, configId];
      }
    });
  };

  const handleTest = async () => {
    if (selectedConfigs.length === 0) {
      alert('최소 하나의 configuration을 선택해주세요.');
      return;
    }

    setLoading(true);
    setResults(null);
    setEvalResults(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await testUsageAction(input, selectedAgent, selectedConfigs as any);
      setResults(res);
      console.log('클라이언트 결과:', res);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (selectedConfigs.length === 0) {
      alert('최소 하나의 configuration을 선택해주세요.');
      return;
    }

    setLoading(true);
    setResults(null);
    setEvalResults(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await evaluateAgentAction(selectedAgent, selectedConfigs as any);
      setEvalResults(res);
      console.log('평가 결과:', res);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Agent 테스트 & 평가
      </Typography>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Tabs value={mode} onChange={(_, value) => setMode(value)}>
          <Tab label="단일 입력 테스트" value="single" />
          <Tab label="전체 평가" value="evaluate" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="agent-select-label">에이전트 선택</InputLabel>
          <Select
            labelId="agent-select-label"
            value={selectedAgent}
            label="에이전트 선택"
            onChange={(e) => setSelectedAgent(e.target.value as AgentName)}
          >
            {AGENT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label} - {option.description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Configuration 선택 ({selectedConfigs.length}개 선택됨)
          {supportedConfigurations.length > 0 && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              (이 에이전트는 {supportedConfigurations.length}개 configuration을 지원합니다)
            </Typography>
          )}
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: 'action.hover',
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {supportedConfigurations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              <CircularProgress size={24} sx={{ mb: 1 }} />
              <Typography variant="body2">지원하는 configuration 정보를 불러오는 중...</Typography>
            </Box>
          ) : (
            // Configuration을 모델별로 그룹화
            Object.entries(
              supportedConfigurations.reduce(
                (acc, config) => {
                  if (!acc[config.model]) {
                    acc[config.model] = [];
                  }
                  acc[config.model].push(config);
                  return acc;
                },
                {} as Record<TextModel, typeof supportedConfigurations>,
              ),
            ).map(([model, configs]) => {
              const modelOption = MODEL_OPTIONS.find((opt) => opt.value === model);
              return (
                <Box key={model} sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="text.secondary"
                    sx={{
                      mb: 1,
                      pb: 0.5,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    {modelOption?.label || model} ({configs.length}개)
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    {configs.map((config) => (
                      <FormControlLabel
                        key={config.id}
                        control={<Checkbox checked={selectedConfigs.includes(config.id)} onChange={() => toggleConfig(config.id)} />}
                        label={<Typography variant="body2">{config.label}</Typography>}
                        sx={{
                          m: 0,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      </Box>

      {mode === 'single' && (
        <>
          <Box sx={{ mt: 3 }}>
            <TextField fullWidth multiline rows={3} label="테스트 입력" value={input} onChange={(e) => setInput(e.target.value)} />
            {selectedAgent === 'translator' && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Translator 입력 형식:</strong> JSON 형식으로 입력해주세요.
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 1 }}>
                  {`{ "text": "조금", "sourceLanguage": "ko", "targetLanguage": "ja" }`}
                </Typography>
              </Alert>
            )}
          </Box>

          <Button variant="contained" size="large" onClick={handleTest} disabled={loading || selectedConfigs.length === 0} sx={{ mt: 3 }}>
            {loading ? `실행 중... (${selectedConfigs.length}개 config)` : `Agent 실행하기 (${selectedConfigs.length}개 config)`}
          </Button>
        </>
      )}

      {mode === 'evaluate' && (
        <>
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              전체 평가 모드
            </Typography>
            <Typography variant="body2">
              {testCases.length}개의 테스트 케이스로 선택한 모델들을 평가합니다. 정확도, 토큰 사용량, 비용을 확인할 수 있습니다.
            </Typography>
          </Alert>

          <Button
            variant="contained"
            size="large"
            onClick={handleEvaluate}
            disabled={loading || selectedConfigs.length === 0}
            sx={{ mt: 3 }}
          >
            {loading ? `평가 중... (${selectedConfigs.length}개 config)` : `평가 시작 (${testCases.length}개 케이스)`}
          </Button>
        </>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            결과 비교 ({results.length}개 configuration)
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.map((result: any) => (
              <Paper
                key={result.configId}
                elevation={2}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="h6" component="h3">
                    📊 {result.label}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ⏱️ 실행 시간:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {result.executionTimeMs}ms ({(result.executionTimeMs / 1000).toFixed(2)}초)
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Agent 출력:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      backgroundColor: 'grey.50',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    <Typography
                      component="pre"
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        m: 0,
                      }}
                    >
                      {JSON.stringify(result.result, null, 2)}
                    </Typography>
                  </Paper>
                </Box>

                {result.priceBreakdown && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      💰 비용 분석:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        backgroundColor: 'info.lighter',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            일반 입력:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {result.priceBreakdown.regularInputTokens.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            캐시 입력:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            {result.priceBreakdown.cachedInputTokens.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            출력:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {result.priceBreakdown.outputTokens.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            총 비용:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="primary.main">
                            ${result.priceBreakdown.totalCost.toFixed(6)}
                          </Typography>
                        </Box>
                      </Box>
                      {result.priceBreakdown.savedByCaching > 0 && (
                        <>
                          <Divider sx={{ my: 1.5 }} />
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            💡 캐싱 절약: ${result.priceBreakdown.savedByCaching.toFixed(6)}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    📈 Usage 정보:
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      backgroundColor: 'grey.50',
                      maxHeight: 150,
                      overflowY: 'auto',
                    }}
                  >
                    <Typography
                      component="pre"
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        m: 0,
                      }}
                    >
                      {JSON.stringify(result.usage, null, 2)}
                    </Typography>
                  </Paper>
                </Box>
              </Paper>
            ))}
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              💡 서버 콘솔을 확인하세요!
            </Typography>
            <Typography variant="body2">터미널에서 각 모델별 상세한 Usage 구조가 출력됩니다.</Typography>
          </Alert>
        </Box>
      )}

      {evalResults && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            평가 결과 ({evalResults.length}개 configuration)
          </Typography>

          {/* 필터 영역 */}
          <Paper variant="outlined" sx={{ p: 3, mt: 3, mb: 3, backgroundColor: 'action.hover' }}>
            <Typography variant="h6" gutterBottom>
              🔍 필터
            </Typography>

            {/* Configuration 필터 */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Configuration 필터 {filterModels.length > 0 && `(${filterModels.length}개 모델 선택됨)`}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {/* 실제 모델별로 필터링 */}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {([...new Set(evalResults.map((r: any) => r.model))] as TextModel[]).map((model: TextModel) => (
                  <Chip
                    key={model}
                    label={MODEL_OPTIONS.find((opt) => opt.value === model)?.label || model}
                    onClick={() => {
                      setFilterModels((prev: TextModel[]) =>
                        prev.includes(model) ? prev.filter((m: TextModel) => m !== model) : [...prev, model],
                      );
                    }}
                    color={filterModels.includes(model) ? 'primary' : 'default'}
                    variant={filterModels.includes(model) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
                {filterModels.length > 0 && (
                  <Chip
                    label="전체 선택 해제"
                    onClick={() => setFilterModels([])}
                    color="error"
                    variant="outlined"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </Box>
            </Box>

            {/* 정답 여부 필터 */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                정답 여부 필터
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip
                  label="전체"
                  onClick={() => setFilterResult('all')}
                  color={filterResult === 'all' ? 'primary' : 'default'}
                  variant={filterResult === 'all' ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="✅ 통과만"
                  onClick={() => setFilterResult('passed')}
                  color={filterResult === 'passed' ? 'success' : 'default'}
                  variant={filterResult === 'passed' ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="❌ 실패만"
                  onClick={() => setFilterResult('failed')}
                  color={filterResult === 'failed' ? 'error' : 'default'}
                  variant={filterResult === 'failed' ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Configuration별 요약 */}
          {(() => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const filteredResults = evalResults.filter((result: any) => filterModels.length === 0 || filterModels.includes(result.model));

            if (filteredResults.length === 0) {
              return (
                <Alert severity="warning" sx={{ mt: 3 }}>
                  <Typography variant="body2">선택한 필터에 해당하는 결과가 없습니다. 필터를 조정해주세요.</Typography>
                </Alert>
              );
            }

            return (
              <Box
                sx={{
                  mt: 3,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {filteredResults.map((result: any) => (
                  <Paper
                    key={result.configId}
                    elevation={3}
                    sx={{
                      p: 3,
                      borderLeft: 4,
                      borderColor: result.accuracy >= 80 ? 'success.main' : result.accuracy >= 60 ? 'warning.main' : 'error.main',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {result.label}
                      </Typography>
                      <Chip
                        label={`${result.accuracy.toFixed(1)}%`}
                        color={result.accuracy >= 80 ? 'success' : result.accuracy >= 60 ? 'warning' : 'error'}
                        sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        📊 정확도
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={result.accuracy >= 80 ? 'success.main' : 'text.primary'}>
                        {result.passedCount} / {result.totalCount}
                      </Typography>
                    </Box>

                    {result.executionTime && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          ⏱️ 실행 시간
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              케이스당 (평균)
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="info.main">
                              {result.executionTime.avg}ms
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              전체 총합
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="info.dark">
                              {(result.executionTime.total / 1000).toFixed(2)}초
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {result.priceBreakdown && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          💰 비용
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              케이스당 (평균)
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                              ${result.priceBreakdown.avg.totalCost.toFixed(6)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              전체 총합
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="secondary.main">
                              ${result.priceBreakdown.total.totalCost.toFixed(6)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        🔢 토큰 사용량
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          평균 (케이스당)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              입력
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {result.usage.avg.inputTokens}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              출력
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {result.usage.avg.outputTokens}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              총
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {result.usage.avg.totalTokens}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          총합 (전체)
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              입력
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary.main">
                              {result.usage.total.inputTokens.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              출력
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary.main">
                              {result.usage.total.outputTokens.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              총
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="secondary.main">
                              {result.usage.total.totalTokens.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            );
          })()}

          {/* 상세 결과 */}
          {/* eslint-disable @typescript-eslint/no-explicit-any */}
          {evalResults
            .filter((result: any) => filterModels.length === 0 || filterModels.includes(result.model))
            .map((result: any) => {
              // 정답 여부 필터링
              const filteredEvaluations = result.evaluations.filter((evaluation: any) => {
                if (filterResult === 'passed') return evaluation.passed;
                if (filterResult === 'failed') return !evaluation.passed;
                return true; // 'all'
              });

              // 필터링 결과가 없으면 configuration 자체를 표시하지 않음
              if (filteredEvaluations.length === 0) return null;

              return (
                <Box key={`detail-${result.configId}`} sx={{ mt: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {result.label} - 상세 결과
                    {filterResult !== 'all' && (
                      <Chip label={`${filteredEvaluations.length}개 표시 중`} size="small" color="primary" sx={{ ml: 2 }} />
                    )}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    {filteredEvaluations.map((evaluation: any, idx: number) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 2,
                          mb: 2,
                          borderLeft: 4,
                          borderColor: evaluation.passed ? 'success.main' : 'error.main',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {evaluation.passed ? '✅' : '❌'} {evaluation.description || `테스트 ${idx + 1}`}
                          </Typography>
                          <Chip label={evaluation.passed ? '통과' : '실패'} size="small" color={evaluation.passed ? 'success' : 'error'} />
                        </Box>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            입력:
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'grey.50', mb: 2 }}>
                            <Typography variant="body2">
                              {typeof evaluation.input === 'string' ? evaluation.input : JSON.stringify(evaluation.input, null, 2)}
                            </Typography>
                          </Paper>

                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                기대 출력:
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'success.lighter' }}>
                                <Typography
                                  component="pre"
                                  variant="body2"
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    m: 0,
                                  }}
                                >
                                  {JSON.stringify(evaluation.expectedOutput, null, 2)}
                                </Typography>
                              </Paper>
                            </Box>

                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                실제 출력:
                              </Typography>
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 1.5,
                                  backgroundColor: evaluation.passed ? 'success.lighter' : 'error.lighter',
                                }}
                              >
                                <Typography
                                  component="pre"
                                  variant="body2"
                                  sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    m: 0,
                                  }}
                                >
                                  {evaluation.actualOutput ? JSON.stringify(evaluation.actualOutput, null, 2) : evaluation.error || 'null'}
                                </Typography>
                              </Paper>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              );
            })}

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              💡 서버 콘솔을 확인하세요!
            </Typography>
            <Typography variant="body2">터미널에서 각 모델별 평가 요약 정보가 출력됩니다.</Typography>
          </Alert>
        </Box>
      )}
    </Container>
  );
}
