'use server';

import { adminApp } from '@/data';

export const consoleAdminApp = async () => {
  console.log('adminApp', adminApp);
  return { success: true, message: 'adminApp 콘솔에 출력되었습니다' };
};
