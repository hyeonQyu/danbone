import { DocumentEntity } from '@/data/entity.types';
import { JmdictEntry } from './jmdict.types';

export type JmdictEntity = JmdictEntry & DocumentEntity;

export type JmdictTermType = 'kanji' | 'kana';

export interface JmdictSearchIndexEntity {
  entryId: string;
  searchTerm: string;
  termType: JmdictTermType;
  common: boolean;
}
