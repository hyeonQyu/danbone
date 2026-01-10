import { Primitive } from 'zod';

export const toUniqueArray = <T, K extends Exclude<Primitive, null | undefined>>(items: T[], keyGetter: (item: T) => K) => {
  return Array.from(new Set(items.map(keyGetter)));
};
