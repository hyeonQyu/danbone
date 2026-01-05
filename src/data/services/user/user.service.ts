import { getServiceCreator } from '@/data/services/service.utils';
import { UserService, UserServiceDependencies } from '@/data/services/user/user.service.types';
import { DuplicateError } from '@/errors';

export const createUserService = getServiceCreator<UserService, UserServiceDependencies>(({ userRepository }) => {
  return {
    register: async (data) => {
      if (await userRepository.getUserByEmail(data.email)) {
        throw new DuplicateError('이미 존재하는 이메일입니다.');
      }

      return userRepository.createUser(data);
    },
  };
});
