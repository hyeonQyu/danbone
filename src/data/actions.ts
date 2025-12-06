'use server';

import { firebaseAdmin } from '@/data/firebaseAdmin.config';

export const consoleAdminApp = async () => {
  console.log('firebaseAdmin', firebaseAdmin);
  return { success: true, message: 'adminApp 콘솔에 출력되었습니다' };
};
