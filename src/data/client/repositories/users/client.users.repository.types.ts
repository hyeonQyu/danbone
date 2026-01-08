import { Unsubscribe, User } from 'firebase/auth';

export interface UsersClientRepository {
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => Unsubscribe;
}
