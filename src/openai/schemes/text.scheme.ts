import z from 'zod';

export const TextSchema = z.object({
  text: z.string(),
});

export const TextsSchema = z.object({
  texts: z.array(z.string()),
});

export type Text = z.infer<typeof TextSchema>;
export type Texts = z.infer<typeof TextsSchema>;
