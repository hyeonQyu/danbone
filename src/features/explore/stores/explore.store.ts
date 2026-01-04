import { create } from 'zustand';

interface ExploreState {
  query: string;
}

interface ExploreAction {
  setQuery: (query: string) => void;
  reset: () => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  query: '',
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  reset: () => set(initialState),
}));
