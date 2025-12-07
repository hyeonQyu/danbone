import { UsersClientRepository } from '@/data/client/repositories';
import { LoginData, LoginResult } from '@/features/users';
import { User } from 'firebase/auth';

export interface UserClientService {
  login: (data: LoginData) => Promise<LoginResult>;
  logout: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
}

export interface UserClientServiceDependencies {
  usersRepository: UsersClientRepository;
}
