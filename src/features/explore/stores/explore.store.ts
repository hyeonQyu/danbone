import { Language } from '@/language/language.types';
import { create } from 'zustand';

export type ExploreViewType = 'home' | 'search';

interface ExploreState {
  viewType: ExploreViewType;
  queryLanguage: Language;
}

interface ExploreAction {
  setViewType: (viewType: ExploreViewType) => void;
  setQueryLanguage: (language: Language) => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  viewType: 'home',
  queryLanguage: 'ko',
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  setViewType: (viewType) => set({ viewType }),
  setQueryLanguage: (selectedLanguage) => set({ queryLanguage: selectedLanguage }),
}));
