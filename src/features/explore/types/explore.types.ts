import { Language, SourceLanguage } from '@/language';

export type ExploreSearchOption = {
  query: string;
  queryLanguage: Language;
  sourceLanguage: SourceLanguage;
};

export type ExploreSearchResult<T extends object> = {
  text: string;
  entries: T[];
};

export type ExploreSearchHandler<T extends object> = (option: ExploreSearchOption) => Promise<Array<ExploreSearchResult<T>>>;
