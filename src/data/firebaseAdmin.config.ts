import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const initializeFirebaseAdmin = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

      const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });

      console.log('✅ Firebase Admin SDK 초기화 완료 (서비스 계정 JSON)');
      return app;
    }

    throw new Error(
      'Firebase Admin SDK 초기화 실패: 환경 변수가 설정되지 않았습니다.\n\n' +
        '서비스 계정 JSON 전체를 사용:\n' +
        '- FIREBASE_SERVICE_ACCOUNT',
    );
  } catch (error) {
    console.error('❌ Firebase Admin SDK 초기화 실패:', error);
    throw error;
  }
};

const app = initializeFirebaseAdmin();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const firebaseAdmin = { auth, db, storage };
