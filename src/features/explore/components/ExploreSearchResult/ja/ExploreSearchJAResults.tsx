import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import ExploreSearchResultCardTemplate from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultCardTemplate';
import ExploreSearchResultsContainer from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultsContainer';
import DictionaryJAEntryCard from '@/features/explore/components/ExploreSearchResult/ja/DictionaryJAEntryCard';
import { ExploreSearchResult } from '@/features/explore/types';
import { useTypedRouter } from '@/routes';

interface ExploreSearchJAResultProps {
  results: Array<ExploreSearchResult<DictionaryEntryByLanguage['ja']>>;
}

function ExploreSearchJAResults({ results }: ExploreSearchJAResultProps) {
  const router = useTypedRouter();

  const handleEntryClick = (entry: DictionaryEntryByLanguage['ja']) => {
    router.push('/explore/search/[id]', {
      searchParams: { id: entry.id },
    });
  };

  return (
    <ExploreSearchResultsContainer>
      {results.map((result) => (
        <ExploreSearchResultCardTemplate
          key={result.text}
          result={result}
          renderEntry={(entry) => <DictionaryJAEntryCard entry={entry} onClick={handleEntryClick} />}
        />
      ))}
    </ExploreSearchResultsContainer>
  );
}

export default ExploreSearchJAResults;
