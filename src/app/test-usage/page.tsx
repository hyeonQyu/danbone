'use client';

import { useState } from 'react';
import { testUsageAction } from './actions';

export default function TestUsagePage() {
  const [input, setInput] = useState('안녕하세요. 저는 대한민국 사람입니다.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof testUsageAction>> | null>(null);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await testUsageAction(input);
      setResult(res);
      console.log('클라이언트 결과:', res);
    } catch (error) {
      console.error('에러:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Usage 구조 테스트</h1>

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
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '실행 중...' : 'Agent 실행하기'}
      </button>

      {result && (
        <div style={{ marginTop: '30px' }}>
          <h2>결과</h2>

          <div style={{ marginTop: '20px' }}>
            <h3>Agent 출력:</h3>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(result.result, null, 2)}
            </pre>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Usage 정보:</h3>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '12px',
              }}
            >
              {JSON.stringify(result.usage, null, 2)}
            </pre>
          </div>

          {result.priceBreakdown && (
            <div style={{ marginTop: '20px' }}>
              <h3>💰 비용 분석:</h3>
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666' }}>일반 입력 토큰:</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>
                      {result.priceBreakdown.regularInputTokens.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666' }}>캐시 입력 토큰:</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                      {result.priceBreakdown.cachedInputTokens.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666' }}>출력 토큰:</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold' }}>
                      {result.priceBreakdown.outputTokens.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666' }}>총 비용:</p>
                    <p style={{ margin: '5px 0', fontSize: '18px', fontWeight: 'bold', color: '#0070f3' }}>
                      ${result.priceBreakdown.totalCost.toFixed(6)}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                  <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                    일반 입력: ${result.priceBreakdown.regularInputCost.toFixed(6)} | 캐시 입력: $
                    {result.priceBreakdown.cachedInputCost.toFixed(6)} | 출력: ${result.priceBreakdown.outputCost.toFixed(6)}
                  </p>
                  {result.priceBreakdown.savedByCaching > 0 && (
                    <p style={{ margin: '10px 0 0 0', color: '#10b981', fontWeight: 'bold' }}>
                      💡 캐싱으로 절약: ${result.priceBreakdown.savedByCaching.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#fffbea', borderRadius: '6px' }}>
            <p>
              <strong>💡 서버 콘솔을 확인하세요!</strong>
            </p>
            <p>터미널에서 상세한 Usage 구조가 출력됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
