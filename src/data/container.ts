import { userRepository } from '@/data/repositories';
import { createUserService } from '@/data/services';

export const userService = createUserService({ userRepository });
