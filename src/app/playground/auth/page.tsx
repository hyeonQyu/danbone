'use client';

import { getMyProfile } from '@/features/users';
import { useState } from 'react';

export default function ProfileTestPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMyProfile();
      setProfile(result.data);
    } catch (err: any) {
      setError(err.message || '프로필을 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>인증 테스트 페이지</h1>
      <p>로그인 후 이 페이지에서 프로필 정보를 가져올 수 있습니다.</p>

      <button
        onClick={handleGetProfile}
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? '로딩 중...' : '내 프로필 가져오기'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fee',
            borderRadius: '4px',
            color: '#c00',
          }}
        >
          <strong>에러:</strong> {error}
        </div>
      )}

      {profile && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#efe',
            borderRadius: '4px',
          }}
        >
          <h2>내 프로필</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
