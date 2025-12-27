import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import { UserServerService, UserServerServiceDependencies } from '@/data/server/services/user/server.user.service.types';
import { DuplicateError, NotFoundError } from '@/errors';

export const createUserServerService = getServerServiceCreator<UserServerService, UserServerServiceDependencies>(({ usersRepository }) => {
  return {
    register: async (data) => {
      if (await usersRepository.getUserByEmail(data.email)) {
        throw new DuplicateError('이미 존재하는 이메일입니다.');
      }

      return usersRepository.createUser(data);
    },

    getUserProfile: async (userId) => {
      const user = await usersRepository.getUserById(userId);

      if (!user) {
        throw new NotFoundError('사용자를 찾을 수 없습니다.');
      }

      return user;
    },
  };
});
