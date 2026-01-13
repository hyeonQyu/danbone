import { LanguageSchema } from '@/language';
import z from 'zod';

export const DictionaryInputSchema = z.object({
  sourceLanguage: LanguageSchema,
  words: z.array(z.string()),
});

export type DictionaryInput = z.infer<typeof DictionaryInputSchema>;
