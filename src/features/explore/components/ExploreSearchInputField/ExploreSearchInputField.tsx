import { SearchInputField, SearchInputFieldProps } from '@/components/SearchInputField';
import { Language, useGetLanguageLabel } from '@/language';

interface ExploreSearchInputFieldProps extends Omit<SearchInputFieldProps, 'placeholder'> {
  queryLanguage: Language;
}

function ExploreSearchInputField({ queryLanguage, ...props }: ExploreSearchInputFieldProps) {
  const getLanguageLabel = useGetLanguageLabel();

  return <SearchInputField placeholder={`${getLanguageLabel(queryLanguage)} 단어 및 문장`} {...props} />;
}

export default ExploreSearchInputField;
