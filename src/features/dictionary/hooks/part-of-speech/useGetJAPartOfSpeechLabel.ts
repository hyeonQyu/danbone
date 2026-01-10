import { PartOfSpeechByLanguage } from '@/features/dictionary/dictionary.types';

const labelByPartOfSpeech: Record<PartOfSpeechByLanguage['ja'], string> = {
  godanVerb: '1그룹 동사',
  ichidanVerb: '2그룹 동사',
  irregularVerb: '3그룹 동사',
  noun: '명사',
  naAdjective: 'な형용사',
  iAdjective: 'い형용사',
  adverb: '부사',
  particle: '조사',
  conjunction: '접속사',
  interjection: '감탄사',
};

export const useGetJAPartOfSpeechLabel = () => {
  return (partOfSpeeches: PartOfSpeechByLanguage['ja'][]) => {
    return partOfSpeeches.map((pos) => labelByPartOfSpeech[pos]).join(', ');
  };
};
