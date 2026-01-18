import { ErrorView } from '@/components/ErrorView';
import { Loading } from '@/components/Loading';
import { useDictionaryEntryJAFetchQueryOptions } from '@/features/dictionary/hooks/useDictionaryEntryJAFetchQueryOptions';
import { useQuery } from '@tanstack/react-query';
import DictionaryJAEntryDetail from './DictionaryJAEntryDetail';

interface DictionaryJAEntryDetailViewProps {
  id: string;
}

function DictionaryJAEntryDetailView({ id }: DictionaryJAEntryDetailViewProps) {
  const dictionaryEntryJAFetchQueryOptions = useDictionaryEntryJAFetchQueryOptions(id);

  const { data: entry, isLoading, isError } = useQuery(dictionaryEntryJAFetchQueryOptions);

  if (isLoading) {
    return <Loading sx={{ height: '100%' }} />;
  }

  if (isError || !entry) {
    return <ErrorView title="조회 실패" message="잠시 후 다시 시도해주세요." />;
  }

  return <DictionaryJAEntryDetail entry={entry} />;
}

export default DictionaryJAEntryDetailView;
