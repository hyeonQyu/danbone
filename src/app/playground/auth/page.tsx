'use client';

import { userServiceClient } from '@/data/client';
import { firebase } from '@/data/client/firebase';
import { getMyProfile } from '@/features/users';
import { deleteCookie, getCookie } from '@/lib';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function AuthPlaygroundPage() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasIdTokenCookie, setHasIdTokenCookie] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // useQuery로 Server Action 호출
  const {
    data: serverProfile,
    error: serverError,
    refetch: refetchServerProfile,
    isLoading: isServerLoading,
  } = useQuery({
    queryKey: ['profile', 'server'],
    queryFn: getMyProfile,
    enabled: false, // 수동 실행
  });

  // useQuery로 Client SDK 직접 호출 테스트 (서버 거치지 않고 Firestore 직접 접근)
  const {
    data: clientProfile,
    error: clientError,
    refetch: refetchClientProfile,
    isLoading: isClientLoading,
  } = useQuery({
    queryKey: ['profile', 'client'],
    queryFn: async () => {
      if (!user) throw new Error('로그인이 필요합니다');
      const userDoc = await getDoc(doc(firebase.db, 'users', user.uid));
      if (!userDoc.exists()) throw new Error('사용자를 찾을 수 없습니다');
      return userDoc.data();
    },
    enabled: false, // 수동 실행
  });

  // 결과 초기화 함수
  const clearResults = () => {
    setProfile(null);
    setError(null);
    setSuccessMessage(null);
    // useQuery 결과도 초기화
    queryClient.removeQueries({ queryKey: ['profile', 'server'] });
    queryClient.removeQueries({ queryKey: ['profile', 'client'] });
  };

  // Firebase 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 쿠키 상태 주기적 체크
  useEffect(() => {
    const checkCookie = () => {
      setHasIdTokenCookie(!!getCookie('idToken'));
    };

    checkCookie();
    const interval = setInterval(checkCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  // 로그인
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await userServiceClient.login({ email, password });
      setSuccessMessage('로그인 성공!');
      setPassword(''); // 보안을 위해 비밀번호 초기화
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 가져오기 (수동 방식) - Error throw 방식으로 처리
  const handleGetProfile = async () => {
    clearResults();
    setLoading(true);
    try {
      const result = await getMyProfile();
      setProfile(result);
      setSuccessMessage('프로필 조회 성공! (수동 방식)');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`에러: ${err.message}`);

        // ExpiredTokenError면 동기화 시도
        if (err.name === 'ExpiredTokenError') {
          setError('토큰 만료! 토큰 동기화 시도 중...');
        }
      } else {
        setError('예상치 못한 에러가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // idToken만 삭제 (테스트용)
  const handleDeleteIdToken = () => {
    deleteCookie('idToken');
    setSuccessMessage(null);
    setError('⚠️ idToken 쿠키를 삭제했습니다. 이제 "내 프로필 가져오기"를 클릭하여 동기화 메커니즘을 테스트해보세요.');
  };

  // 완전 로그아웃
  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await userServiceClient.logout();
      setProfile(null);
      setEmail('');
      setPassword('');
      setSuccessMessage('로그아웃 성공!');
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>🔐 인증 테스트 플레이그라운드</h1>

      {/* 상태 표시 */}
      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3 style={{ marginTop: 0 }}>현재 상태</h3>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Firebase 로그인:</strong>{' '}
          {user ? (
            <>
              ✅ {user.email} <span style={{ fontSize: '0.8em', color: '#666' }}>({user.uid.substring(0, 8)}...)</span>
            </>
          ) : (
            '❌ 로그아웃'
          )}
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>🍪 idToken 쿠키:</strong> {hasIdTokenCookie ? '✅ 존재' : '❌ 없음'}
        </p>
      </div>

      {/* 로그인 폼 or 테스트 버튼들 */}
      {!user ? (
        <div style={{ marginBottom: '2rem' }}>
          <h2>로그인</h2>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              padding: '0.75rem',
              width: '100%',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              display: 'block',
              marginBottom: '1rem',
              padding: '0.75rem',
              width: '100%',
              fontSize: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading || !email || !password ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            {loading ? '로그인 중...' : '🔑 로그인'}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '2rem' }}>
          <h2>테스트 액션</h2>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>기존 방식 (수동)</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button
              onClick={handleGetProfile}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              📋 내 프로필 가져오기 (수동)
            </button>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>useQuery 테스트 (자동 재시도)</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <button
              onClick={() => {
                clearResults();
                refetchServerProfile();
              }}
              disabled={isServerLoading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: isServerLoading ? '#ccc' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isServerLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              🔄 Server Action (useQuery)
            </button>
            <button
              onClick={() => {
                clearResults();
                refetchClientProfile();
              }}
              disabled={isClientLoading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: isClientLoading ? '#ccc' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isClientLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              🔄 Firestore 직접 조회 (useQuery)
            </button>
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>유틸리티</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDeleteIdToken}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              🗑️ idToken만 삭제
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#ccc' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              🚪 완전 로그아웃
            </button>
          </div>

          {/* 테스트 시나리오 가이드 */}
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f0f7ff',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
          >
            <strong>💡 테스트 시나리오:</strong>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>
                <strong>useQuery 자동 재시도:</strong> &quot;idToken만 삭제&quot; → &quot;Server Action (useQuery)&quot; 클릭 → 자동 복구 후
                성공 ✅
              </li>
              <li>
                <strong>Firestore 직접:</strong> &quot;Firestore 직접 조회 (useQuery)&quot; 클릭 → 서버 거치지 않고 DB 직접 조회 ✅
              </li>
              <li>
                <strong>수동 재시도:</strong> &quot;내 프로필 가져오기 (수동)&quot; → 수동으로 재시도 로직 테스트 ✅
              </li>
            </ol>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              💡 <strong>차이점:</strong> Server Action은 서버에서 인증 후 데이터 조회, Firestore 직접은 클라이언트에서 Firebase SDK로 바로
              조회
            </p>
          </div>
        </div>
      )}

      {/* useQuery 결과 표시 */}
      {(serverProfile || serverError || clientProfile || clientError) && (
        <div style={{ marginBottom: '1rem' }}>
          <h3>useQuery 결과</h3>

          {/* Server Action 결과 */}
          {serverProfile && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#e8f5e9',
                borderRadius: '4px',
                border: '1px solid #81c784',
              }}
            >
              <h4 style={{ marginTop: 0, color: '#2e7d32' }}>✅ Server Action 성공 (useQuery 자동 재시도)</h4>
              <pre
                style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                }}
              >
                {JSON.stringify(serverProfile, null, 2) as React.ReactNode}
              </pre>
            </div>
          )}

          {serverError && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#ffebee',
                borderRadius: '4px',
                color: '#c62828',
                border: '1px solid #ef5350',
              }}
            >
              <strong>⚠️ Server Action 에러:</strong> {(serverError as Error).message}
              <br />
              <small>에러 타입: {(serverError as Error).name}</small>
            </div>
          )}

          {/* Client SDK 결과 */}
          {clientProfile && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                border: '1px solid #90caf9',
              }}
            >
              <h4 style={{ marginTop: 0, color: '#1976d2' }}>✅ Firestore 직접 조회 성공</h4>
              <pre
                style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.9rem',
                }}
              >
                {JSON.stringify(clientProfile, null, 2) as React.ReactNode}
              </pre>
            </div>
          )}

          {clientError && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#ffebee',
                borderRadius: '4px',
                color: '#c62828',
                border: '1px solid #ef5350',
              }}
            >
              <strong>⚠️ Client SDK 에러:</strong> {(clientError as Error).message}
            </div>
          )}
        </div>
      )}

      {/* 성공 메시지 */}
      {successMessage ? (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            color: '#2e7d32',
            border: '1px solid #81c784',
          }}
        >
          <strong>✅ {successMessage}</strong>
        </div>
      ) : null}

      {/* 에러 표시 */}
      {error && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            color: '#c62828',
            border: '1px solid #ef5350',
          }}
        >
          <strong>⚠️ {error}</strong>
        </div>
      )}

      {/* 프로필 표시 */}
      {profile && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            border: '1px solid #81c784',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#2e7d32' }}>✅ 프로필 조회 성공</h2>
          <pre
            style={{
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.9rem',
            }}
          >
            {JSON.stringify(profile, null, 2) as React.ReactNode}
          </pre>
        </div>
      )}
    </div>
  );
}
