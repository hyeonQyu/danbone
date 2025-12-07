'use client';

import { userServiceClient } from '@/data/client';

export const login = userServiceClient.login;
export const logout = userServiceClient.logout;
export const getCurrentUser = userServiceClient.getCurrentUser;
export const onAuthStateChanged = userServiceClient.onAuthStateChanged;
