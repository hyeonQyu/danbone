import ExploreSearchResultCardTemplate from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultCardTemplate';
import ExploreSearchResultsContainer from '@/features/explore/components/ExploreSearchResult/common/ExploreSearchResultsContainer';
import DictionaryJAWord from '@/features/explore/components/ExploreSearchResult/ja/DictionaryJAWord';
import { ExploreSearchResult } from '@/features/explore/types';
import { DictionaryWordByLanguage } from '@/openai';

interface ExploreSearchJAResultProps {
  results: Array<ExploreSearchResult<DictionaryWordByLanguage['ja']>>;
}

function ExploreSearchJAResults({ results }: ExploreSearchJAResultProps) {
  return (
    <ExploreSearchResultsContainer>
      {results.map((result) => (
        <ExploreSearchResultCardTemplate key={result.text} result={result} renderWord={(word) => <DictionaryJAWord word={word} />} />
      ))}
    </ExploreSearchResultsContainer>
  );
}

export default ExploreSearchJAResults;
