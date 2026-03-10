import { PartOfSpeechByLanguage } from '@/features/dictionary/dictionary.types';

const labelByPartOfSpeech: Record<PartOfSpeechByLanguage['ko'], string> = {
  verb: '동사',
  noun: '명사',
  adjective: '형용사',
  adverb: '부사',
  particle: '조사',
  conjunction: '접속사',
  article: '관사',
  interjection: '감탄사',
};

export const useGetKOPartOfSpeechLabel = () => {
  return (pos: PartOfSpeechByLanguage['ko']) => {
    return labelByPartOfSpeech[pos];
  };
};
