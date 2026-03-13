import { CreateUserData, UserEntity } from '@/features/users';
import { type Unsubscribe, type User } from 'firebase/auth';

export interface UsersServerRepository {
  createUser: (user: CreateUserData) => Promise<UserEntity>;
  getUserByEmail: (email: string) => Promise<UserEntity | null>;
  getUserById: (id: string) => Promise<UserEntity | null>;
}

export interface UsersClientRepository {
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => Unsubscribe;
}
