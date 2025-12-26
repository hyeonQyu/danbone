import { Language, SourceLanguage } from '@/language';

export type SearchOption = {
  query: string;
  queryLanguage: Language;
  sourceLanguage: SourceLanguage;
};

export type SearchResult<T extends object> = {
  text: string;
  entries: T[];
};

export type ExploreSearchHandler<T extends object> = (option: SearchOption) => Promise<Array<SearchResult<T>>>;
