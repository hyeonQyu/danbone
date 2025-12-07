import { firebaseAdmin } from '@/data/server/firebaseAdmin.config';
import { Auth } from 'firebase-admin/auth';

export const getServerServiceCreator =
  <TService, TDependencies extends object>(implementation: (dependencies: TDependencies, auth: Auth) => TService) =>
  (dependencies: TDependencies) =>
    implementation(dependencies, firebaseAdmin.auth);
