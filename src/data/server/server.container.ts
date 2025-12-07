import { usersServerRepository } from '@/data/server/repositories/users';
import { createUserServerService } from '@/data/server/services';

export const userServiceServer = createUserServerService({ usersRepository: usersServerRepository });
