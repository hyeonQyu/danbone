import { ErrorView } from '@/components/ErrorView';
import { Loading } from '@/components/Loading';
import { getDictionaryEntryJA } from '@/features/dictionary/actions/findJmdict.action';
import { DICTIONARY_QUERY_KEY } from '@/features/dictionary/dictionary.queryKey';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { useSourceLanguage } from '@/language';
import { TIME_UNIT } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import DictionaryJAEntryDetail from './DictionaryJAEntryDetail';

interface DictionaryJAEntryDetailViewProps {
  id: string;
}

function DictionaryJAEntryDetailView({ id }: DictionaryJAEntryDetailViewProps) {
  const sourceLanguage = useSourceLanguage();

  const {
    data: entry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: DICTIONARY_QUERY_KEY.entry.get(id, sourceLanguage),
    queryFn: async (): Promise<DictionaryEntryByLanguage['ja'] | null> => {
      return await getDictionaryEntryJA({ entryId: id, sourceLanguage });
    },
    enabled: Boolean(id && sourceLanguage),
    staleTime: TIME_UNIT.unitOfMs.asMinute * 10,
  });

  if (isLoading) {
    return <Loading sx={{ height: '100%' }} />;
  }

  if (isError || !entry) {
    return <ErrorView sx={{ height: '100%' }} title="조회 실패" message="잠시 후 다시 시도해주세요." />;
  }

  return <DictionaryJAEntryDetail entry={entry} />;
}

export default DictionaryJAEntryDetailView;
