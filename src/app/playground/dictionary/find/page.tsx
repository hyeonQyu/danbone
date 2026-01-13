'use client';

import { JmdictEntity } from '@/features/dictionary';
import { findJmdictById, findJmdictByTerm } from '@/features/dictionary/actions';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { devLogTap } from '@/lib';
import { useState } from 'react';

type SearchResult = {
  entries: JmdictEntity[] | DictionaryEntryByLanguage['ja'][];
  duration: number;
  readCount: number;
  error?: string;
};

export default function JmdictFindPage() {
  const [idInput, setIdInput] = useState('');
  const [kanjiInput, setKanjiInput] = useState('');
  const [kanaInput, setKanaInput] = useState('');

  const [idResult, setIdResult] = useState<SearchResult | null>(null);
  const [kanjiResult, setKanjiResult] = useState<SearchResult | null>(null);
  const [kanaResult, setKanaResult] = useState<SearchResult | null>(null);

  const [idLoading, setIdLoading] = useState(false);
  const [kanjiLoading, setKanjiLoading] = useState(false);
  const [kanaLoading, setKanaLoading] = useState(false);

  // ID로 조회
  const handleSearchById = async () => {
    if (!idInput.trim()) return;

    setIdLoading(true);
    setIdResult(null);

    try {
      const startTime = performance.now();
      const data = await findJmdictById(idInput.trim());
      const duration = performance.now() - startTime;

      if (data) {
        setIdResult({
          entries: [data],
          duration,
          readCount: 1,
        });
      } else {
        setIdResult({
          entries: [],
          duration,
          readCount: 1,
          error: '해당 ID의 데이터를 찾을 수 없습니다.',
        });
      }
    } catch (error) {
      setIdResult({
        entries: [],
        duration: 0,
        readCount: 1,
        error: error instanceof Error ? error.message : '조회 실패',
      });
    } finally {
      setIdLoading(false);
    }
  };

  // 한자로 조회
  const handleSearchByKanji = async () => {
    if (!kanjiInput.trim()) return;

    setKanjiLoading(true);
    setKanjiResult(null);

    try {
      const startTime = performance.now();
      const data = await findJmdictByTerm({ searchTerm: kanjiInput.trim(), termType: 'kanji' });
      const duration = performance.now() - startTime;

      devLogTap(data, 'kanji search result');

      if (!data) {
        setKanjiResult({
          entries: [],
          duration,
          readCount: 1,
          error: '결과를 찾을 수 없습니다.',
        });
        return;
      }

      // 예상 read count: index 조회 (평균 2-3) + entry 조회 (N개)
      const estimatedIndexReads = Math.min(data.length * 1.5, 5);
      const estimatedReadCount = Math.ceil(estimatedIndexReads + data.length);

      setKanjiResult({
        entries: data,
        duration,
        readCount: estimatedReadCount,
      });
    } catch (error) {
      setKanjiResult({
        entries: [],
        duration: 0,
        readCount: 1,
        error: error instanceof Error ? error.message : '조회 실패',
      });
    } finally {
      setKanjiLoading(false);
    }
  };

  // 카나로 조회
  const handleSearchByKana = async () => {
    if (!kanaInput.trim()) return;

    setKanaLoading(true);
    setKanaResult(null);

    try {
      const startTime = performance.now();
      const data = await findJmdictByTerm({ searchTerm: kanaInput.trim(), termType: 'kana' });
      const duration = performance.now() - startTime;

      devLogTap(data, 'kana search result');

      if (!data) {
        setKanaResult({
          entries: [],
          duration,
          readCount: 1,
          error: '결과를 찾을 수 없습니다.',
        });
        return;
      }

      const estimatedIndexReads = Math.min(data.length * 1.5, 5);
      const estimatedReadCount = Math.ceil(estimatedIndexReads + data.length);

      setKanaResult({
        entries: data,
        duration,
        readCount: estimatedReadCount,
      });
    } catch (error) {
      setKanaResult({
        entries: [],
        duration: 0,
        readCount: 1,
        error: error instanceof Error ? error.message : '조회 실패',
      });
    } finally {
      setKanaLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>JMdict 데이터 조회 테스트</h1>

      {/* ID로 조회 섹션 */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          border: '1px solid #0ea5e9',
        }}
      >
        <h2 style={{ marginTop: 0 }}>1. ID로 조회</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchById()}
            placeholder="예: 1000320"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={handleSearchById}
            disabled={idLoading || !idInput.trim()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: idLoading || !idInput.trim() ? '#ccc' : '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: idLoading || !idInput.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {idLoading ? '조회 중...' : '조회'}
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>
          예시: <code>1000320</code>, <code>1000010</code>, <code>1000040</code>
        </div>
        {idResult && <ResultDisplay result={idResult} />}
      </section>

      {/* 한자로 조회 섹션 */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#fef3f2',
          borderRadius: '8px',
          border: '1px solid #f87171',
        }}
      >
        <h2 style={{ marginTop: 0 }}>2. 한자로 조회</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={kanjiInput}
            onChange={(e) => setKanjiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchByKanji()}
            placeholder="예: 日本"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={handleSearchByKanji}
            disabled={kanjiLoading || !kanjiInput.trim()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: kanjiLoading || !kanjiInput.trim() ? '#ccc' : '#f87171',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: kanjiLoading || !kanjiInput.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {kanjiLoading ? '조회 중...' : '조회'}
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>
          예시: <code>日本</code>, <code>食べる</code>, <code>学校</code>
        </div>
        {kanjiResult && <ResultDisplay result={kanjiResult} />}
      </section>

      {/* 카나로 조회 섹션 */}
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #22c55e',
        }}
      >
        <h2 style={{ marginTop: 0 }}>3. 카나로 조회</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={kanaInput}
            onChange={(e) => setKanaInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchByKana()}
            placeholder="예: にほん"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={handleSearchByKana}
            disabled={kanaLoading || !kanaInput.trim()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: kanaLoading || !kanaInput.trim() ? '#ccc' : '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: kanaLoading || !kanaInput.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {kanaLoading ? '조회 중...' : '조회'}
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666' }}>
          예시: <code>にほん</code>, <code>たべる</code>, <code>がっこう</code>
        </div>
        {kanaResult && <ResultDisplay result={kanaResult} />}
      </section>

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
        <h3 style={{ marginTop: 0 }}>사용 가이드</h3>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>ID 조회: 정확한 entry ID를 입력하면 해당 데이터를 조회합니다.</li>
          <li>한자 조회: 한자를 입력하면 해당 한자를 포함하는 모든 entry를 조회합니다.</li>
          <li>카나 조회: 카나를 입력하면 해당 카나를 포함하는 모든 entry를 조회합니다.</li>
          <li>Common 단어가 우선적으로 표시됩니다.</li>
          <li>조회 시간과 예상 Firestore read 비용이 표시됩니다.</li>
        </ul>
      </div>
    </div>
  );
}

// 결과 표시 컴포넌트
function ResultDisplay({ result }: { result: SearchResult }) {
  if (result.error) {
    return (
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#fee',
          borderRadius: '4px',
          color: '#c00',
        }}
      >
        <strong>오류:</strong> {result.error}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* 통계 정보 */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>
            <strong>조회 시간:</strong> {result.duration.toFixed(0)}ms
          </div>
          <div>
            <strong>Firestore Reads:</strong> ~{result.readCount}
          </div>
          <div>
            <strong>결과 개수:</strong> {result.entries.length}개
          </div>
        </div>
      </div>

      {/* Entry 목록 */}
      {result.entries.length === 0 ? (
        <div style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>결과가 없습니다.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result.entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// Entry 카드 컴포넌트
function EntryCard({ entry }: { entry: JmdictEntity | DictionaryEntryByLanguage['ja'] }) {
  const hasCommon = entry.kanji.some((k) => k.common) || entry.kana.some((k) => k.common);

  return (
    <div
      style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '2px solid #ddd',
        position: 'relative',
      }}
    >
      {/* Common 배지 */}
      {hasCommon && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#fbbf24',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          COMMON
        </div>
      )}

      {/* ID */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#666' }}>
        <strong>ID:</strong> <code>{entry.id}</code>
      </div>

      {/* 한자 */}
      {entry.kanji.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <strong>한자:</strong>{' '}
          {entry.kanji.map((k, i) => (
            <span key={i}>
              {k.text}
              {k.common && <span style={{ color: '#fbbf24', fontSize: '0.85rem', marginLeft: '0.25rem' }}>★</span>}
              {i < entry.kanji.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      {/* 카나 */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>카나:</strong>{' '}
        {entry.kana.map((k, i) => (
          <span key={i}>
            {k.text}
            {k.common && <span style={{ color: '#fbbf24', fontSize: '0.85rem', marginLeft: '0.25rem' }}>★</span>}
            {i < entry.kana.length - 1 && ', '}
          </span>
        ))}
      </div>

      {/* 의미 */}
      <div>
        <strong>의미:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          {entry.sense.slice(0, 3).map((sense, i) => (
            <li key={i} style={{ marginBottom: '0.5rem' }}>
              {sense.gloss.map((g) => g.text).join(', ')}
              {sense.partOfSpeech.length > 0 && (
                <span style={{ color: '#666', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({sense.partOfSpeech.join(', ')})</span>
              )}
            </li>
          ))}
          {entry.sense.length > 3 && <li style={{ color: '#666', fontSize: '0.85rem' }}>...외 {entry.sense.length - 3}개 의미</li>}
        </ul>
      </div>
    </div>
  );
}
