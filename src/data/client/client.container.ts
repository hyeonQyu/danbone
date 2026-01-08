'use client';

import { usersClientRepository } from '@/data/client/repositories';
import { createUserClientService } from '@/data/client/service';

export const userServiceClient = createUserClientService({ usersRepository: usersClientRepository });
