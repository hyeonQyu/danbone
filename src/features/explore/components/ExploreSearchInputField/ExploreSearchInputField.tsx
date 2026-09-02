import { SearchInputField, SearchInputFieldProps } from '@/components/SearchInputField';
import { getLanguageLabel, Language } from '@/language';

interface ExploreSearchInputFieldProps extends Omit<SearchInputFieldProps, 'placeholder'> {
  queryLanguage: Language;
}

function ExploreSearchInputField({ queryLanguage, ...props }: ExploreSearchInputFieldProps) {
  return <SearchInputField placeholder={`${getLanguageLabel(queryLanguage)} 단어 및 문장`} {...props} />;
}

export default ExploreSearchInputField;
