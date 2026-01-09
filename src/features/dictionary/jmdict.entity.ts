import { DocumentEntity } from '@/data/entity.types';
import { JmdictEntry } from './jmdict.types';

export type JmdictEntity = JmdictEntry & DocumentEntity;

export interface JmdictSearchIndexEntity {
  entryId: string;
  searchTerm: string;
  termType: 'kanji' | 'kana';
  common: boolean;
}
