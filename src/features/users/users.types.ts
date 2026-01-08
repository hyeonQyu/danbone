import { DocumentEntity } from '@/data/entity.types';

export interface UserEntity extends DocumentEntity {
  email: string;
  name: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResult {
  user: Pick<UserEntity, 'id' | 'email' | 'name'>;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}
