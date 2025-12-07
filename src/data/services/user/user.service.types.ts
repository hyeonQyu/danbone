import { UsersRepository } from '@/data/repositories';
import { CreateUserData, UserEntity } from '@/features/users';

export interface UserService {
  register: (data: CreateUserData) => Promise<UserEntity>;
}

export interface UserServiceDependencies {
  userRepository: UsersRepository;
}
