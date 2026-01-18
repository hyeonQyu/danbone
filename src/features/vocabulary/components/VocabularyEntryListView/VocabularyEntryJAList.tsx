import { convertJmdictEntityToDictionaryEntry, JmdictEntity } from '@/features/dictionary';
import { DictionaryJAEntryCard } from '@/features/explore/components/ExploreSearchResult';
import { VocabularyEntryWithLearning } from '@/features/vocabulary/vocabulary.types';
import { useSourceLanguage } from '@/language';
import { Box } from '@mui/material';

interface VocabularyEntryJAListProps {
  entries: VocabularyEntryWithLearning<JmdictEntity>[];
}

function VocabularyEntryJAList({ entries }: VocabularyEntryJAListProps) {
  const sourceLanguage = useSourceLanguage();

  const handleEntryClick = (entryId: string) => {
    // TODO: 단어 클릭 시 상세 페이지로 이동하는 핸들러 구현 필요
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {entries.map(({ entryId, dictionaryEntry }) => (
        <DictionaryJAEntryCard key={entryId} entry={convertJmdictEntityToDictionaryEntry(dictionaryEntry, sourceLanguage)} />
      ))}
    </Box>
  );
}

export default VocabularyEntryJAList;
