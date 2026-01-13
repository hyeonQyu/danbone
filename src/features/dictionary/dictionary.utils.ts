import { toUniqueArray } from '@/lib';
import { identity } from 'es-toolkit';
import { DictionaryEntryByLanguage, PartOfSpeechByLanguage } from './dictionary.types';
import { JmdictEntity } from './jmdict.entity';
import { JmdictPartOfSpeech } from './jmdict.types';

const jmdictPartOfSpeechToDanbonePartOfSpeech = (jmdictPos: JmdictPartOfSpeech): PartOfSpeechByLanguage['ja'] | null => {
  // 동사 매핑
  if (jmdictPos.startsWith('v5')) return 'godanVerb';
  if (jmdictPos === 'v1' || jmdictPos === 'v1-s') return 'ichidanVerb';
  if (jmdictPos === 'vk') return 'irregularVerb'; // 来る
  if (jmdictPos === 'vs' || jmdictPos === 'vs-c' || jmdictPos === 'vs-s' || jmdictPos === 'vs-i') return 'irregularVerb'; // する동사들
  if (jmdictPos === 'vz') return 'irregularVerb'; // ずる동사
  if (jmdictPos === 'vr') return 'irregularVerb'; // 불규칙동사
  if (jmdictPos === 'v2a-s') return 'ichidanVerb'; // 특수 2단 동사
  if (jmdictPos === 'vn') return 'noun'; // 명사화 동사

  // 새로 추가된 품사
  if (jmdictPos === 'aux') return 'auxiliary'; // 조동사
  if (jmdictPos === 'aux-v') return 'auxiliaryVerb'; // 보조동사
  if (jmdictPos === 'aux-adj') return 'auxiliaryAdjective'; // 보조형용사
  if (jmdictPos === 'cop') return 'copula'; // 계사
  if (jmdictPos === 'ctr') return 'counter'; // 조수사
  if (jmdictPos === 'exp') return 'expression'; // 관용구
  if (jmdictPos === 'pref' || jmdictPos === 'n-pref') return 'prefix'; // 접두사
  if (jmdictPos === 'suf' || jmdictPos === 'n-suf') return 'suffix'; // 접미사

  // 기존 품사 매핑
  if (jmdictPos === 'adj-na') return 'naAdjective';
  if (jmdictPos === 'adj-i' || jmdictPos === 'adj-ix') return 'iAdjective';
  if (jmdictPos === 'adj-ku' || jmdictPos === 'adj-no' || jmdictPos === 'adj-pn' || jmdictPos === 'adj-t' || jmdictPos === 'adj-f')
    return 'iAdjective'; // 특수 형용사들도 い형용사로 통합
  if (jmdictPos === 'adv' || jmdictPos === 'adv-to') return 'adverb';
  if (jmdictPos === 'prt') return 'particle';
  if (jmdictPos === 'conj') return 'conjunction';
  if (jmdictPos === 'int') return 'interjection';

  // 명사 관련
  if (jmdictPos.startsWith('n') || jmdictPos === 'num' || jmdictPos === 'pn') return 'noun';

  // vi(자동사), vt(타동사)는 품사가 아니라 misc 정보이므로 null
  if (jmdictPos === 'vi' || jmdictPos === 'vt') return null;

  // unc(unclassified)는 분류 불가
  if (jmdictPos === 'unc') return null;

  return null;
};

const mapPartOfSpeeches = (jmdictPosArray: JmdictPartOfSpeech[]): PartOfSpeechByLanguage['ja'][] => {
  const mapped = jmdictPosArray
    .map(jmdictPartOfSpeechToDanbonePartOfSpeech)
    .filter((pos): pos is PartOfSpeechByLanguage['ja'] => Boolean(pos));
  return toUniqueArray(mapped, identity);
};

export const convertJmdictEntityToDictionaryEntry = (
  { sense, ...restEntity }: JmdictEntity,
  sourceLanguage: string,
): DictionaryEntryByLanguage['ja'] => {
  return {
    ...restEntity,
    sense: sense
      .filter(({ gloss }) => gloss.some(({ lang }) => lang === sourceLanguage))
      .map(({ partOfSpeech, gloss, ...restSense }) => ({
        ...restSense,
        partOfSpeech: mapPartOfSpeeches(partOfSpeech),
        gloss: gloss.filter(({ lang }) => lang === sourceLanguage),
      })),
  };
};
