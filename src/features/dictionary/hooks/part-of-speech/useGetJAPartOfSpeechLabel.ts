import { jaPartOfSpeechLabels } from '@/features/dictionary/dictionary.ja.labels';
import { useGetPartOfSpeechLabel } from './useGetPartOfSpeechLabel';

export const useGetJAPartOfSpeechLabel = () => {
  return useGetPartOfSpeechLabel(jaPartOfSpeechLabels);
};
