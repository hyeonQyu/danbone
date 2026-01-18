import { convertJmdictEntityToDictionaryEntry, DictionaryEntryByLanguage, JmdictEntity } from '@/features/dictionary';
import { DictionaryJAEntryCard } from '@/features/explore/components/ExploreSearchResult';
import { VocabularyEntryWithLearning } from '@/features/vocabulary/vocabulary.types';
import { useSourceLanguage } from '@/language';
import { useTypedRouter } from '@/routes';
import { Box } from '@mui/material';

interface VocabularyEntryJAListProps {
  entries: VocabularyEntryWithLearning<JmdictEntity>[];
}

function VocabularyEntryJAList({ entries }: VocabularyEntryJAListProps) {
  const sourceLanguage = useSourceLanguage();

  const router = useTypedRouter();

  const handleEntryClick = (entry: DictionaryEntryByLanguage['ja']) => {
    router.push('/vocabulary/[id]', {
      searchParams: { id: entry.id },
    });
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
        <DictionaryJAEntryCard
          key={entryId}
          entry={convertJmdictEntityToDictionaryEntry(dictionaryEntry, sourceLanguage)}
          onClick={handleEntryClick}
        />
      ))}
    </Box>
  );
}

export default VocabularyEntryJAList;
