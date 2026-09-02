import z from 'zod';

export const normalizeToSchema = <T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> => {
  if (!data || typeof data !== 'object') {
    return data as z.infer<T>;
  }

  if (schema instanceof z.ZodDiscriminatedUnion) {
    const discriminatorKey = schema._def.discriminator;
    const discriminatorValue = (data as Record<string, unknown>)[discriminatorKey];

    const optionSchema = schema._def.optionsMap.get(discriminatorValue);
    if (optionSchema) {
      return normalizeToSchema(optionSchema, data);
    }
    return data as z.infer<T>;
  }

  if (!(schema instanceof z.ZodObject)) {
    return data as z.infer<T>;
  }

  const normalized = { ...data } as Record<string, unknown>;
  const shape = schema.shape;

  for (const key in shape) {
    const fieldSchema = shape[key];
    const value = normalized[key];

    if (value === undefined || value === null) continue;

    if (fieldSchema instanceof z.ZodArray) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        normalized[key] = [value];
      } else if (!Array.isArray(value)) {
        normalized[key] = [value];
      }
    } else if (fieldSchema instanceof z.ZodObject && typeof value === 'object') {
      normalized[key] = normalizeToSchema(fieldSchema, value);
    }
  }

  return normalized as z.infer<T>;
};
