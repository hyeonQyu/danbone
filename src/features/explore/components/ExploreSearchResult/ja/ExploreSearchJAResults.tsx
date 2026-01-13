import ExploreSearchResultCardTemplate from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultCardTemplate';
import ExploreSearchResultsContainer from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultsContainer';
import DictionaryJAEntryCard from '@/features/explore/components/ExploreSearchResult/ja/DictionaryJAEntryCard';
import { DictionaryEntryByLanguage } from '@/features/dictionary/dictionary.types';
import { ExploreSearchResult } from '@/features/explore/types';

interface ExploreSearchJAResultProps {
  results: Array<ExploreSearchResult<DictionaryEntryByLanguage['ja']>>;
}

function ExploreSearchJAResults({ results }: ExploreSearchJAResultProps) {
  return (
    <ExploreSearchResultsContainer>
      {results.map((result) => (
        <ExploreSearchResultCardTemplate key={result.text} result={result} renderEntry={(entry) => <DictionaryJAEntryCard entry={entry} />} />
      ))}
    </ExploreSearchResultsContainer>
  );
}

export default ExploreSearchJAResults;
