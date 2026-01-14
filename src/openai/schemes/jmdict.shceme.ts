import { JmdictGlossSchema } from '@/features/dictionary';
import { LanguageSchema } from '@/language';
import z from 'zod';

export const JmdictTranslationSchema = z.object({
  sourceLanguage: LanguageSchema,
  kanjis: z.array(z.string()),
  kanas: z.array(z.string()),
  glosses: z.array(JmdictGlossSchema),
});

export type JmdictTranslationParams = z.infer<typeof JmdictTranslationSchema>;
