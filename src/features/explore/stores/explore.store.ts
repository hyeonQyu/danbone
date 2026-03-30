import { Language } from '@/language/language.types';
import { create } from 'zustand';

interface ExploreState {
  queryLanguage: Language;
  query: string;
}

interface ExploreAction {
  setQueryLanguage: (language: Language) => void;
  setQuery: (query: string) => void;
  reset: () => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  queryLanguage: 'ko',
  query: '',
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  setQueryLanguage: (selectedLanguage) => set({ queryLanguage: selectedLanguage }),
  setQuery: (query) => set({ query }),
  reset: () => set(initialState),
}));
