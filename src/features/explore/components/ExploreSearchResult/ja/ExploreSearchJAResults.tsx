import ExploreSearchResultCardTemplate from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultCardTemplate';
import ExploreSearchResultsContainer from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultsContainer';
import DictionaryJAEntry from '@/features/explore/components/ExploreSearchResult/ja/DictionaryJAEntry';
import { ExploreSearchResult } from '@/features/explore/types';
import { DictionaryEntryByLanguage } from '@/openai';

interface ExploreSearchJAResultProps {
  results: Array<ExploreSearchResult<DictionaryEntryByLanguage['ja']>>;
}

function ExploreSearchJAResults({ results }: ExploreSearchJAResultProps) {
  return (
    <ExploreSearchResultsContainer>
      {results.map((result) => (
        <ExploreSearchResultCardTemplate key={result.text} result={result} renderEntry={(entry) => <DictionaryJAEntry entry={entry} />} />
      ))}
    </ExploreSearchResultsContainer>
  );
}

export default ExploreSearchJAResults;
