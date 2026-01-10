import { overEvery, toUniqueArray } from '@/lib';
import { DictionaryWordByLanguage } from '@/openai';
import { identity } from 'es-toolkit';
import { DictionaryEntryByLanguage, PartOfSpeechByLanguage } from './dictionary.types';
import { JmdictEntity } from './jmdict.entity';

const mapJmdictPosToInternalPos = (jmdictPos: string): PartOfSpeechByLanguage['ja'] | null => {
  if (jmdictPos.startsWith('v5')) return 'godanVerb';
  if (jmdictPos === 'v1') return 'ichidanVerb';
  if (jmdictPos === 'vk' || jmdictPos === 'vs-i') return 'irregularVerb';
  if (jmdictPos === 'adj-na') return 'naAdjective';
  if (jmdictPos === 'adj-i') return 'iAdjective';
  if (jmdictPos === 'adv') return 'adverb';
  if (jmdictPos === 'prt') return 'particle';
  if (jmdictPos === 'conj') return 'conjunction';
  if (jmdictPos === 'int') return 'interjection';
  if (jmdictPos.startsWith('n')) return 'noun';
  return null;
};

const mapJmdictPosArrayToInternalPosArray = (jmdictPosArray: string[]): PartOfSpeechByLanguage['ja'][] => {
  const mapped = jmdictPosArray.map(mapJmdictPosToInternalPos).filter((pos): pos is PartOfSpeechByLanguage['ja'] => Boolean(pos));
  return toUniqueArray(mapped, identity);
};

const hasMeanings = (entry: DictionaryEntryByLanguage['ja']) => entry.meanings.length > 0;
const hasPartOfSpeeches = (entry: DictionaryEntryByLanguage['ja']) => entry.partOfSpeeches.length > 0;

export const convertJmdictEntityToWord = (entity: JmdictEntity, sourceLanguage: string): DictionaryWordByLanguage['ja'] => {
  const notation = entity.kanji[0]?.text || entity.kana[0]?.text;
  const pronunciation = entity.kana[0]?.text || '';

  return {
    keyword: notation,
    entries: entity.sense
      .map((sense) => ({
        notation,
        pronunciation,
        partOfSpeeches: mapJmdictPosArrayToInternalPosArray(sense.partOfSpeech),
        meanings: sense.gloss.filter(({ lang }) => lang === sourceLanguage).map(({ text }) => text),
        examples: [],
      }))
      .filter(overEvery(hasMeanings, hasPartOfSpeeches)),
  };
};
