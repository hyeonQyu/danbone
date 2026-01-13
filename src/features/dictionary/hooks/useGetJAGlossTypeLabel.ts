import { jaGlossTypeLabels } from '@/features/dictionary/dictionary.ja.labels';
import { JmdictGlossType } from '@/features/dictionary/jmdict.types';

export const useGetJAGlossTypeLabel = () => {
  return (glossType: JmdictGlossType | null) => {
    return glossType ? jaGlossTypeLabels[glossType] : null;
  };
};
