'use client';

import { getJmdictProgress, saveJmdictBatch } from '@/features/dictionary/actions';
import { JmdictEntry } from '@/features/dictionary/jmdict.types';
import { useState } from 'react';

const ENTRIES_BATCH_SIZE = 1000;

export default function JmdictSavePage() {
  const [jsonData, setJsonData] = useState<JmdictEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    savedEntries: number;
    savedIndexes: number;
    totalStored: number;
    isComplete: boolean;
    duration: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 파일 업로드 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const text = await file.text();
      const parsed = JSON.parse(text);

      // 배열이면 그대로 사용, 객체면 words 속성 추출
      let data: JmdictEntry[];
      if (Array.isArray(parsed)) {
        data = parsed;
      } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.words)) {
        data = parsed.words;
      } else {
        throw new Error('JSON 파일은 배열이거나 { words: [...] } 형식이어야 합니다.');
      }

      setJsonData(data);
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 읽기 실패');
      setJsonData(null);
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!jsonData) {
      setError('먼저 JSON 파일을 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 서버로부터 현재 진행 상태 가져오기
      const progressResponse = await getJmdictProgress();
      if (!progressResponse.success || !progressResponse.data) {
        throw new Error('진행 상태 조회 실패');
      }

      const { startIndex } = progressResponse.data;

      // 완료 확인
      if (startIndex >= jsonData.length) {
        setResult({
          savedEntries: 0,
          savedIndexes: 0,
          totalStored: startIndex,
          isComplete: true,
          duration: 0,
        });
        return;
      }

      // 2. 필요한 배치만 슬라이스
      const batch = jsonData.slice(startIndex, startIndex + ENTRIES_BATCH_SIZE);

      // 3. 작은 배치만 서버로 전송
      const response = await saveJmdictBatch(batch);

      if (!response.success || !response.data) {
        throw new Error(response.error || '저장 실패');
      }

      // 4. 결과 업데이트 (클라이언트가 totalStored 계산)
      const totalStored = startIndex + response.data.savedEntries;
      setResult({
        savedEntries: response.data.savedEntries,
        savedIndexes: response.data.savedIndexes,
        totalStored,
        isComplete: totalStored >= jsonData.length,
        duration: response.data.duration,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = result && jsonData ? Math.round((result.totalStored / jsonData.length) * 100) : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>📚 JMdict Firestore 저장</h1>

      {/* 파일 업로드 섹션 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h2 style={{ marginTop: 0 }}>1. JSON 파일 업로드</h2>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{
            display: 'block',
            marginBottom: '1rem',
            padding: '0.5rem',
            width: '100%',
          }}
        />
        {jsonData && (
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <p>✅ 파일 로드 완료</p>
            <p>총 Entries: {jsonData.length.toLocaleString()}개</p>
          </div>
        )}
      </div>

      {/* 진행 상태 표시 */}
      {result && (
        <div
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '1px solid #90caf9',
          }}
        >
          <h2 style={{ marginTop: 0 }}>📊 진행 상태</h2>
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
              }}
            >
              {result.totalStored.toLocaleString()} / {jsonData?.length.toLocaleString()} ({progressPercentage}%)
            </div>
            <div
              style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  backgroundColor: '#4caf50',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
          {result.isComplete && <div style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.1rem' }}>✅ 저장 완료!</div>}
        </div>
      )}

      {/* 저장 버튼 섹션 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          border: '1px solid #ffb74d',
        }}
      >
        <h2 style={{ marginTop: 0 }}>2. 저장</h2>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p>💡 한 번 클릭 시 자동으로 다음 {ENTRIES_BATCH_SIZE}개 entries 저장</p>
          <p>⚠️ 무료 플랜 제한: 하루 20,000 writes (권장: 4,000 entries/일)</p>
          <p>📅 예상 소요일: 5일</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || !jsonData || (result?.isComplete ?? false)}
          style={{
            padding: '1rem 2rem',
            backgroundColor: loading || !jsonData || result?.isComplete ? '#ccc' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading || !jsonData || result?.isComplete ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            width: '100%',
          }}
        >
          {loading ? '저장 중...' : result?.isComplete ? '저장 완료' : `저장 (다음 ${ENTRIES_BATCH_SIZE}개)`}
        </button>
      </div>

      {/* 저장 결과 표시 */}
      {result && !result.isComplete && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1.5rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #81c784',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2e7d32' }}>✅ 저장 성공</h2>
          <ul style={{ marginBottom: 0 }}>
            <li>저장된 Entries: {result.savedEntries.toLocaleString()}개</li>
            <li>생성된 검색 인덱스: {result.savedIndexes.toLocaleString()}개</li>
            <li>총 저장된 Entries: {result.totalStored.toLocaleString()}개</li>
            <li>소요 시간: {(result.duration / 1000).toFixed(1)}초</li>
            <li>남은 Entries: {jsonData ? (jsonData.length - result.totalStored).toLocaleString() : 0}개</li>
          </ul>
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fff3e0',
              borderRadius: '4px',
            }}
          >
            <strong>💡 다음 단계:</strong> 내일 다시 &quot;저장&quot; 버튼을 클릭하면 자동으로 이어서 저장됩니다.
          </div>
        </div>
      )}

      {/* 완료 메시지 */}
      {result?.isComplete && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1.5rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            border: '2px solid #4caf50',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2e7d32' }}>🎉 모든 데이터 저장 완료!</h2>
          <p>총 {result.totalStored.toLocaleString()}개의 entries가 Firestore에 저장되었습니다.</p>
          <p>생성된 검색 인덱스: 약 {(result.totalStored * 3).toLocaleString()}개</p>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1.5rem',
            backgroundColor: '#ffebee',
            borderRadius: '8px',
            color: '#c62828',
            border: '1px solid #ef5350',
          }}
        >
          <strong>⚠️ 오류:</strong> {error}
        </div>
      )}

      {/* 사용 가이드 */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '0.9rem',
        }}
      >
        <h3 style={{ marginTop: 0 }}>📖 사용 가이드</h3>
        <ol style={{ paddingLeft: '1.5rem' }}>
          <li>jmdict-eng-common-3.6.1.json 파일을 업로드합니다.</li>
          <li>&quot;저장&quot; 버튼을 클릭하면 자동으로 다음 4,000개가 저장됩니다.</li>
          <li>무료 플랜 제한(20,000 writes/일)을 고려하여 하루에 한 번만 저장하세요.</li>
          <li>다음날 같은 파일을 업로드하고 다시 &quot;저장&quot; 버튼을 클릭하면 이어서 저장됩니다.</li>
          <li>5일 동안 반복하면 전체 데이터 저장이 완료됩니다.</li>
        </ol>
      </div>
    </div>
  );
}
