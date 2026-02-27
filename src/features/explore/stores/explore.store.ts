import { Language } from '@/language/language.types';
import { create } from 'zustand';

interface ExploreState {
  queryLanguage: Language;
}

interface ExploreAction {
  setQueryLanguage: (language: Language) => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  queryLanguage: 'ko',
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  setQueryLanguage: (selectedLanguage) => set({ queryLanguage: selectedLanguage }),
}));
