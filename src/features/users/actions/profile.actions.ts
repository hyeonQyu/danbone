'use server';

import { userServiceServer } from '@/data/server';
import { withAuth } from '@/data/server/auth.utils';

export const getMyProfile = async () =>
  withAuth(async (userId) => {
    const profile = await userServiceServer.getUserProfile(userId);

    return {
      success: true,
      data: profile,
    };
  });
