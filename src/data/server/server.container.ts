import { jmdictServerRepository } from '@/data/server/repositories/jmdict';
import { usersServerRepository } from '@/data/server/repositories/users';
import { createUserServerService } from '@/data/server/services';
import { createJmdictServerService } from '@/data/server/services/jmdict';

export const userServiceServer = createUserServerService({ usersRepository: usersServerRepository });
export const jmdictServiceServer = createJmdictServerService({ jmdictRepository: jmdictServerRepository });
