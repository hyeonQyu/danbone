import { PartOfSpeechByLanguage } from './dictionary.types';
import { JmdictDialect, JmdictGlossType, JmdictKanaTag, JmdictKanjiTag, JmdictMisc } from './jmdict.types';

/**
 * 일본어 품사 라벨 매핑
 */
export const jaPartOfSpeechLabels: Record<PartOfSpeechByLanguage['ja'], string> = {
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

/**
 * 일본어 한자 태그 라벨 매핑
 * @see https://www.edrdg.org/jmdict/edict_doc.html
 */
export const jaKanjiTagLabels: Record<JmdictKanjiTag, string> = {
  ateji: '음차(音借) 표기', // phonetic reading, not semantic
  iK: '잘못된 한자', // irregular kanji usage
  io: '구식 또는 비표준 한자', // irregular okurigana usage
  oK: '구식 한자', // outdated kanji
  rK: '드문 한자', // rarely-used kanji form
  sK: '검색용 한자', // search-only kanji form
};

/**
 * 일본어 가나 태그 라벨 매핑
 * @see https://www.edrdg.org/jmdict/edict_doc.html
 */
export const jaKanaTagLabels: Record<JmdictKanaTag, string> = {
  gikun: '의훈', // gikun (meaning as reading) or jukujikun (special reading)
  ik: '잘못된 가나', // irregular kana usage
  ok: '구식 가나', // out-dated or obsolete kana usage
  rk: '드문 가나', // rarely used kana form
  sk: '검색용 가나', // search-only kana form
};

/**
 * 일본어 방언 라벨 매핑
 * @see https://www.edrdg.org/jmdict/edict_doc.html
 */
export const jaDialectLabels: Record<JmdictDialect, string> = {
  bra: '브라질 일본어',
  hob: '홋카이도 방언',
  ksb: '간사이 방언',
  ktb: '간토 방언',
  kyb: '교토 방언',
  kyu: '규슈 방언',
  osb: '오사카 방언',
  thb: '도호쿠 방언',
  tsug: '쓰가루 방언',
};

/**
 * 일본어 기타 속성 라벨 매핑
 * @see https://www.edrdg.org/jmdict/edict_doc.html
 */
export const jaMiscLabels: Record<JmdictMisc, string> = {
  abbr: '약어',
  arch: '고어',
  chn: '어린이 말투',
  col: '구어',
  dated: '시대에 뒤떨어진',
  derog: '경멸적',
  euph: '완곡어법',
  fam: '친근한 말투',
  fem: '여성어',
  form: '격식체',
  hist: '역사적 용어',
  hon: '존경어',
  hum: '겸양어',
  id: '관용구',
  joc: '익살스러운',
  male: '남성어',
  'net-sl': '인터넷 은어',
  obs: '폐어',
  'on-mim': '의성어/의태어',
  person: '인명',
  place: '지명',
  poet: '시적 표현',
  pol: '정중어',
  proverb: '속담',
  quote: '인용구',
  rare: '드문 표현',
  sens: '민감한 표현',
  sl: '은어',
  uk: '보통 가나로 씀',
  vulg: '비속어',
  yoji: '사자성어',
};

/**
 * 일본어 의미 유형 라벨 매핑
 * @see https://www.edrdg.org/jmdict/edict_doc.html
 */
export const jaGlossTypeLabels: Record<JmdictGlossType, string> = {
  explanation: '설명',
  figurative: '비유적',
  literal: '문자 그대로',
  trademark: '상표',
};
