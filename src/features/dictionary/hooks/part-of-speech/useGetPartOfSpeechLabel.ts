export const useGetPartOfSpeechLabel = <T extends string>(labelMap: Record<T, string>) => {
  return (partOfSpeeches: T[]) => {
    return partOfSpeeches.map((pos) => labelMap[pos]).join(', ');
  };
};
