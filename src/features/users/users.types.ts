import { DocumentEntity } from '@/data/repositories/entity.types';

export interface UserEntity extends DocumentEntity {
  email: string;
  name: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}
