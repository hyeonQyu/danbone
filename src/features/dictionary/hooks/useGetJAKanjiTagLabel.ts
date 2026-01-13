import { jaKanjiTagLabels } from '@/features/dictionary/dictionary.ja.labels';
import { JmdictKanjiTag } from '@/features/dictionary/jmdict.types';

export const useGetJAKanjiTagLabel = () => {
  return (tags: JmdictKanjiTag[]) => {
    return tags.map((tag) => jaKanjiTagLabels[tag]).join(', ');
  };
};
