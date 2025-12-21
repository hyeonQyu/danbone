import z from 'zod';

export const MorphologicalTokenSchema = z.object({
  surface: z.string(),
  base: z.string(),
});

export const MorphologicalAnalysisResultSchema = z.object({
  tokens: z.array(MorphologicalTokenSchema),
});
