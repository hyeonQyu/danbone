import { DictionaryEntryByLanguage } from '@/features/dictionary';
import { DictionaryJAEntryDetail } from '@/features/dictionary/components/DictionaryEntryDetail';
import { useTypedSearchParams } from '@/routes';

function ExploreDictionaryEntryDetailView() {
  const searchParams = useTypedSearchParams('/explore/search/detail');
  const { language, ...entry } = searchParams;

  const normalizedEntry = {
    ...entry,
    meanings: Array.isArray(entry.meanings) ? entry.meanings : [entry.meanings],
    examples: Array.isArray(entry.examples) ? entry.examples : [entry.examples],
  };

  if (language === 'ja') {
    return <DictionaryJAEntryDetail entry={normalizedEntry as DictionaryEntryByLanguage['ja']} />;
  }

  if (language === 'ko') {
    return <div>한국어 사전은 아직 지원하지 않습니다.</div>;
  }

  return <div>지원하지 않는 언어입니다.</div>;
}

export default ExploreDictionaryEntryDetailView;
