import { CreateUserData, UserEntity, UsersRepository } from '@/data/repositories';

export interface UserService {
  register: (data: CreateUserData) => Promise<UserEntity>;
}

export interface UserServiceDependencies {
  userRepository: UsersRepository;
}
