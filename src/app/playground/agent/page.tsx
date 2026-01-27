'use client';

import { TextModel } from '@/openai/model.types';
import { useEffect, useState } from 'react';
import { getSupportedModels, testUsageAction, type AgentName } from './actions';

const AGENT_OPTIONS = [
  { value: 'searchInputGuardrail', label: 'Search Input Guardrail', description: '입력 문장 수 검증' },
  { value: 'queryClassifier', label: 'Query Classifier', description: '쿼리 타입 분류' },
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
  const [input, setInput] = useState('안녕하세요. 저는 대한민국 사람입니다.');
  const [selectedAgent, setSelectedAgent] = useState<AgentName>('searchInputGuardrail');
  const [selectedModels, setSelectedModels] = useState<TextModel[]>([]);
  const [supportedModels, setSupportedModels] = useState<TextModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Awaited<ReturnType<typeof testUsageAction>> | null>(null);

  // 에이전트가 변경되면 지원하는 모델 목록을 가져옴
  useEffect(() => {
    const loadSupportedModels = async () => {
      const models = await getSupportedModels(selectedAgent);
      setSupportedModels(models);
      // 기존 선택된 모델 중 지원하지 않는 모델은 제거
      setSelectedModels((prev) => prev.filter((model) => models.includes(model)));
    };
    loadSupportedModels();
  }, [selectedAgent]);

  const toggleModel = (model: TextModel) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        return prev.filter((m) => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  const handleTest = async () => {
    if (selectedModels.length === 0) {
      alert('최소 하나의 모델을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const res = await testUsageAction(input, selectedAgent, selectedModels);
      setResults(res);
      console.log('클라이언트 결과:', res);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Usage 구조 테스트</h1>

      <div style={{ marginTop: '20px' }}>
        <label>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>에이전트 선택:</div>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value as AgentName)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            {AGENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          모델 선택 ({selectedModels.length}개 선택됨):
          {supportedModels.length > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#666', marginLeft: '8px' }}>
              (이 에이전트는 {supportedModels.length}개 모델을 지원합니다)
            </span>
          )}
        </div>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '15px',
            backgroundColor: '#fafafa',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {supportedModels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>지원하는 모델 정보를 불러오는 중...</div>
          ) : (
            MODEL_OPTIONS.reduce(
              (acc, option) => {
                const lastCategory = acc[acc.length - 1];
                if (!lastCategory || lastCategory.category !== option.category) {
                  acc.push({ category: option.category, options: [option] });
                } else {
                  lastCategory.options.push(option);
                }
                return acc;
              },
              [] as { category: string; options: typeof MODEL_OPTIONS }[],
            )
              .map((group) => ({
                ...group,
                options: group.options.filter((option) => supportedModels.includes(option.value)),
              }))
              .filter((group) => group.options.length > 0)
              .map((group) => (
                <div key={group.category} style={{ marginBottom: '15px' }}>
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '13px',
                      color: '#555',
                      marginBottom: '8px',
                      paddingBottom: '4px',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    {group.category}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                    {group.options.map((option) => (
                      <label
                        key={option.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          backgroundColor: selectedModels.includes(option.value) ? '#e0f2fe' : 'transparent',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(option.value)}
                          onChange={() => toggleModel(option.value)}
                          style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px' }}>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>
          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>테스트 입력:</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </label>
      </div>

      <button
        onClick={handleTest}
        disabled={loading || selectedModels.length === 0}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading || selectedModels.length === 0 ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading || selectedModels.length === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? `실행 중... (${selectedModels.length}개 모델)` : `Agent 실행하기 (${selectedModels.length}개 모델)`}
      </button>

      {results && (
        <div style={{ marginTop: '30px' }}>
          <h2>결과 비교 ({results.length}개 모델)</h2>

          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {results.map((result) => (
              <div
                key={result.model}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 15px 0',
                    padding: '10px',
                    backgroundColor: '#0070f3',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '16px',
                  }}
                >
                  📊 {result.model}
                </h3>

                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>Agent 출력:</h4>
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '6px',
                      overflow: 'auto',
                      fontSize: '12px',
                      maxHeight: '200px',
                    }}
                  >
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>

                {result.priceBreakdown && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>💰 비용 분석:</h4>
                    <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '6px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                        <div>
                          <p style={{ margin: '3px 0', color: '#666' }}>일반 입력:</p>
                          <p style={{ margin: '3px 0', fontSize: '15px', fontWeight: 'bold' }}>
                            {result.priceBreakdown.regularInputTokens.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: '3px 0', color: '#666' }}>캐시 입력:</p>
                          <p style={{ margin: '3px 0', fontSize: '15px', fontWeight: 'bold', color: '#10b981' }}>
                            {result.priceBreakdown.cachedInputTokens.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: '3px 0', color: '#666' }}>출력:</p>
                          <p style={{ margin: '3px 0', fontSize: '15px', fontWeight: 'bold' }}>
                            {result.priceBreakdown.outputTokens.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: '3px 0', color: '#666' }}>총 비용:</p>
                          <p style={{ margin: '3px 0', fontSize: '15px', fontWeight: 'bold', color: '#0070f3' }}>
                            ${result.priceBreakdown.totalCost.toFixed(6)}
                          </p>
                        </div>
                      </div>
                      {result.priceBreakdown.savedByCaching > 0 && (
                        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                          <p style={{ margin: '0', color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>
                            💡 캐싱 절약: ${result.priceBreakdown.savedByCaching.toFixed(6)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#374151' }}>📈 Usage 정보:</h4>
                  <pre
                    style={{
                      background: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '6px',
                      overflow: 'auto',
                      fontSize: '11px',
                      maxHeight: '150px',
                    }}
                  >
                    {JSON.stringify(result.usage, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#fffbea', borderRadius: '6px' }}>
            <p>
              <strong>💡 서버 콘솔을 확인하세요!</strong>
            </p>
            <p>터미널에서 각 모델별 상세한 Usage 구조가 출력됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
