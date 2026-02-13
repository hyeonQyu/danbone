import z from 'zod';

export const ValidatorSchema = z.object({
  valid: z.boolean(),
});

export type ValidatorOutput = z.infer<typeof ValidatorSchema>;
