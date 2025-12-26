import { Language } from '@/language/language.types';
import { create } from 'zustand';

interface ExploreState {
  queryLanguage: Language;
  searchQuery: string;
}

interface ExploreAction {
  setQueryLanguage: (language: Language) => void;
  setSearchQuery: (query: string) => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  queryLanguage: 'ko',
  searchQuery: '',
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  setQueryLanguage: (selectedLanguage) => set({ queryLanguage: selectedLanguage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
