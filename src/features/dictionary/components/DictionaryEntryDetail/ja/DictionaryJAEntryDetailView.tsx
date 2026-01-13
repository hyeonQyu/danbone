import { getDictionaryEntryJA } from '@/features/dictionary/actions/findJmdict.action';
import { DICTIONARY_QUERY_KEY } from '@/features/dictionary/dictionary.queryKey';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { useSourceLanguage } from '@/language';
import { TIME_UNIT } from '@/lib';
import { Box, CircularProgress, Typography } from '@mui/material';
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !entry) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography variant="body1" color="text.secondary">
          엔트리를 찾을 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return <DictionaryJAEntryDetail entry={entry} />;
}

export default DictionaryJAEntryDetailView;
