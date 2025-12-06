import { getServiceCreator } from '@/data/services/service.utils';
import { UserService, UserServiceDependencies } from '@/data/services/user/user.service.types';

export const createUserService = getServiceCreator<UserService, UserServiceDependencies>(({ userRepository }) => {
  return {
    register: async (data) => {
      return userRepository.createUser(data);
    },
  };
});
