import { jaKanaTagLabels } from '@/features/dictionary/dictionary.ja.labels';
import { JmdictKanaTag } from '@/features/dictionary/jmdict.types';

export const useGetJAKanaTagLabel = () => {
  return (tags: JmdictKanaTag[]) => {
    return tags.map((tag) => jaKanaTagLabels[tag]).join(', ');
  };
};
