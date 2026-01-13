import { jaDialectLabels } from '@/features/dictionary/dictionary.ja.labels';
import { JmdictDialect } from '@/features/dictionary/jmdict.types';

export const useGetJADialectLabel = () => {
  return (dialects: JmdictDialect[]) => {
    return dialects.map((dialect) => jaDialectLabels[dialect]).join(', ');
  };
};
