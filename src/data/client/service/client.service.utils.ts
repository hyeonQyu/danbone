import { firebase } from '@/data/client/firebase';
import { Auth } from 'firebase/auth';

export const getClientServiceCreator =
  <TService, TDependencies extends object>(implementation: (dependencies: TDependencies, auth: Auth) => TService) =>
  (dependencies: TDependencies) =>
    implementation(dependencies, firebase.auth);
