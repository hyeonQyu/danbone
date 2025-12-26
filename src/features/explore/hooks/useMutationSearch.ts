import { searchJA } from '@/features/explore/actions';
import { ExploreSearchHandler } from '@/features/explore/types';
import { Language, TargetLanguage, useSourceLanguage, useTargetLanguage } from '@/language';
import { useMutation } from '@tanstack/react-query';

const searchHandlerGeneratorsByTargetLanguage = {
  ja: searchJA,
} as const satisfies Record<TargetLanguage, ExploreSearchHandler<object>>;

export const useMutationSearch = (queryLanguage: Language) => {
  const sourceLanguage = useSourceLanguage();
  const targetLanguage = useTargetLanguage();

  const search = searchHandlerGeneratorsByTargetLanguage[targetLanguage];

  return useMutation({
    mutationFn: (query: string) => search({ query, queryLanguage, sourceLanguage }),
  });
};
