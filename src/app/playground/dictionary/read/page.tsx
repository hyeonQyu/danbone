'use client';

import { analyzeAllJmdictEntries, JmdictAnalysisResult } from '@/features/dictionary/actions/analyzeJmdict.actions';
import { useState } from 'react';

export default function JmdictAnalyzePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JmdictAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setStartTime(Date.now());
    setElapsedTime(0);

    // 경과 시간 업데이트
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 100);
    }, 100);

    try {
      const analysisResult = await analyzeAllJmdictEntries(500);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      console.error('Analysis error:', err);
    } finally {
      clearInterval(timer);
      setIsAnalyzing(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;

    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jmdict-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyCodeToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.generatedCode);
    alert('코드가 클립보드에 복사되었습니다!');
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}분 ${remainingSeconds}초` : `${remainingSeconds}초`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>JMdict 데이터 구조 분석</h1>

      {/* 설명 섹션 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #0ea5e9',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>이 도구는 무엇을 하나요?</h2>
        <ul style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li>
            DB에 저장된 <strong>모든 JMdict 엔트리</strong>를 분석합니다
          </li>
          <li>
            <code>z.any()</code>로 되어있는 필드(related, antonym, languageSource)의 실제 타입을 파악합니다
          </li>
          <li>misc, tags, partOfSpeech 등의 모든 고유한 값들을 enum으로 추출합니다</li>
          <li>분석 결과를 TypeScript 코드로 자동 생성합니다</li>
          <li>전체 분석 결과를 JSON 파일로 다운로드할 수 있습니다</li>
        </ul>
      </div>

      {/* 컨트롤 섹션 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '2px solid #ddd',
        }}
      >
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          style={{
            padding: '1rem 2rem',
            backgroundColor: isAnalyzing ? '#ccc' : '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            width: '100%',
          }}
        >
          {isAnalyzing ? '분석 중...' : '분석 시작'}
        </button>

        {isAnalyzing && (
          <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              경과 시간: <strong>{formatTime(elapsedTime)}</strong>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              서버에서 모든 데이터를 읽고 분석하는 중입니다...
              <br />
              수십만 개의 엔트리가 있다면 몇 분 정도 걸릴 수 있습니다.
            </div>
          </div>
        )}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fee',
            borderRadius: '8px',
            border: '2px solid #f87171',
            color: '#c00',
          }}
        >
          <h3 style={{ marginTop: 0 }}>오류 발생</h3>
          <p style={{ marginBottom: 0 }}>{error}</p>
        </div>
      )}

      {/* 결과 표시 */}
      {result && (
        <>
          {/* 통계 섹션 */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '2px solid #22c55e',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.5rem' }}>분석 완료!</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>총 엔트리 수</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{result.totalEntries.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Part of Speech 종류</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{result.enums.partOfSpeech.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Misc 종류</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{result.enums.misc.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Kanji Tags</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{result.enums.kanjiTags.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>Kana Tags</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{result.enums.kanaTags.length}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>분석 시간</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>{formatTime(elapsedTime)}</div>
              </div>
            </div>
          </div>

          {/* 다운로드 섹션 */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px solid #ddd',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>다운로드</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={downloadJSON}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                📥 JSON 파일 다운로드
              </button>
              <button
                onClick={copyCodeToClipboard}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                📋 TypeScript 코드 복사
              </button>
            </div>
          </div>

          {/* Enum 값들 표시 */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px solid #ddd',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>발견된 Enum 값들</h2>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {Object.entries(result.enums).map(([key, values]) => (
                <div key={key}>
                  <h3
                    style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1rem',
                      color: '#0ea5e9',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{key}</span>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>({values.length}개)</span>
                  </h3>
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f9fafb',
                      borderRadius: '4px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {values.length === 0 ? (
                      <span style={{ color: '#999' }}>값이 없습니다</span>
                    ) : (
                      values.map((value, index) => (
                        <span key={index}>
                          &quot;{value}&quot;
                          {index < values.length - 1 && ', '}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* z.any() 타입 샘플 */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px solid #ddd',
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: '1.25rem' }}>z.any() 필드 샘플 데이터</h2>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>이 데이터를 분석하여 적절한 타입을 정의할 수 있습니다.</p>

            {Object.entries(result.anyTypes).map(([key, samples]) => (
              <div key={key} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#f59e0b' }}>
                  {key} ({samples.length}개 샘플)
                </h3>
                <pre
                  style={{
                    padding: '1rem',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    borderRadius: '4px',
                    overflowX: 'auto',
                    fontSize: '0.85rem',
                    margin: 0,
                  }}
                >
                  {JSON.stringify(samples.slice(0, 10), null, 2)}
                </pre>
              </div>
            ))}
          </div>

          {/* 생성된 TypeScript 코드 */}
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '2px solid #ddd',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>생성된 TypeScript 코드</h2>
              <button
                onClick={copyCodeToClipboard}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                복사
              </button>
            </div>
            <pre
              style={{
                padding: '1.5rem',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                borderRadius: '8px',
                overflowX: 'auto',
                fontSize: '0.85rem',
                margin: 0,
                maxHeight: '600px',
                overflowY: 'auto',
              }}
            >
              {result.generatedCode}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
