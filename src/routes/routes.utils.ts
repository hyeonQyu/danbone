import { RoutesContext } from '@/routes/routes.types';
import { negate } from 'es-toolkit';

export const accessibleOnLoggedIn = ({ user }: RoutesContext) => Boolean(user);
export const accessibleOnLoggedOut = negate(accessibleOnLoggedIn);
