import { UsersServerRepository } from '@/data/server/repositories/users';
import { CreateUserData, UserEntity } from '@/features/users';

export interface UserServerService {
  register: (data: CreateUserData) => Promise<UserEntity>;
  getUserProfile: (userId: string) => Promise<UserEntity>;
  checkEmailExists: (email: string) => Promise<boolean>;
}

export interface UserServerServiceDependencies {
  usersRepository: UsersServerRepository;
}
