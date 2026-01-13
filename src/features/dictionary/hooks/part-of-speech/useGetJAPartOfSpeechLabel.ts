import { PartOfSpeechByLanguage } from '@/features/dictionary';
import { useGetPartOfSpeechLabel } from './useGetPartOfSpeechLabel';

const labelByPartOfSpeech: Record<PartOfSpeechByLanguage['ja'], string> = {
  godanVerb: '1그룹 동사',
  ichidanVerb: '2그룹 동사',
  irregularVerb: '3그룹 동사',
  auxiliary: '조동사',
  auxiliaryVerb: '보조동사',
  auxiliaryAdjective: '보조형용사',
  copula: '계사',
  noun: '명사',
  counter: '조수사',
  naAdjective: 'な형용사',
  iAdjective: 'い형용사',
  adverb: '부사',
  particle: '조사',
  conjunction: '접속사',
  interjection: '감탄사',
  expression: '관용구',
  prefix: '접두사',
  suffix: '접미사',
};

export const useGetJAPartOfSpeechLabel = () => {
  return useGetPartOfSpeechLabel(labelByPartOfSpeech);
};
