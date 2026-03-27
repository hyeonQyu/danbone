import z from 'zod';

export const TextSchema = z.object({
  text: z.string(),
});

export type Text = z.infer<typeof TextSchema>;
