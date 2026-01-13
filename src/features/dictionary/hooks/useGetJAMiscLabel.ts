import { jaMiscLabels } from '@/features/dictionary/dictionary.ja.labels';
import { JmdictMisc } from '@/features/dictionary/jmdict.types';

export const useGetJAMiscLabel = () => {
  return (miscTags: JmdictMisc[]) => {
    return miscTags.map((tag) => jaMiscLabels[tag]).join(', ');
  };
};
