import { getLanguageLabel } from '@/language';
import { RoutesContext } from '@/routes/routes.types';
import { negate } from 'es-toolkit';

export const accessibleOnLoggedIn = ({ server }: RoutesContext) => Boolean(server?.user);
export const accessibleOnLoggedOut = negate(accessibleOnLoggedIn);

export const getExploreTitle = ({ client }: RoutesContext) =>
  [client?.targetLanguage ? getLanguageLabel(client.targetLanguage) : '', '단어 및 문장 탐색하기'].join(' ').trim();

export const getVocabularyTitle = ({ client }: RoutesContext) =>
  [client?.targetLanguage ? getLanguageLabel(client.targetLanguage) : '', '단어장'].join(' ').trim();
