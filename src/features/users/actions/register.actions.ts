'use server';

import { userServiceServer } from '@/data/server';

export const registerUser = userServiceServer.register;
