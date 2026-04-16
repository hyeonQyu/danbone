import { create } from 'zustand';

interface ExploreState {
  query: string;
  shouldSearch: boolean;
}

interface ExploreAction {
  startSearch: (query: string) => void;
  finishSearch: () => void;
  reset: () => void;
}

type ExploreStore = ExploreState & ExploreAction;

const initialState: ExploreState = {
  query: '',
  shouldSearch: false,
};

export const useExploreStore = create<ExploreStore>((set) => ({
  ...initialState,
  startSearch: (query) => set({ query, shouldSearch: true }),
  finishSearch: () => set({ shouldSearch: false }),
  reset: () => set(initialState),
}));
