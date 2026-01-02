import { CreateUserData, UserEntity } from '@/features/users/users.types';

export interface UsersRepository {
  createUser: (user: CreateUserData) => Promise<UserEntity>;
  getUserByEmail: (email: string) => Promise<UserEntity | null>;
}
