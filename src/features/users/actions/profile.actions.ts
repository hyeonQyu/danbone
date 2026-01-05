'use server';

import { userServiceServer } from '@/data/server';
import { withAuth } from '@/auth/server.auth.utils';

export const getMyProfile = async () => {
  return withAuth(userServiceServer.getUserProfile);
};
