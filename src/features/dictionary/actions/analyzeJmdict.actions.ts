'use server';

import { jmdictEntriesRepository } from '@/data/server/repositories/jmdict/server.jmdictEntries.repository';
import { devLog } from '@/lib';
import { JmdictEntity } from '../jmdict.entity';

export interface JmdictAnalysisResult {
  totalEntries: number;
  enums: {
    kanjiTags: string[];
    kanaTags: string[];
    partOfSpeech: string[];
    field: string[];
    dialect: string[];
    misc: string[];
    info: string[];
    glossLang: string[];
    glossGender: string[];
    glossType: string[];
  };
  anyTypes: {
    related: Record<string, unknown>[];
    antonym: Record<string, unknown>[];
    languageSource: Record<string, unknown>[];
  };
  generatedCode: string;
}

interface AnalysisProgress {
  processedCount: number;
  totalCount: number;
  currentBatch: number;
  isComplete: boolean;
}

export async function analyzeAllJmdictEntries(batchSize: number = 500): Promise<JmdictAnalysisResult> {
  const enumSets = {
    kanjiTags: new Set<string>(),
    kanaTags: new Set<string>(),
    partOfSpeech: new Set<string>(),
    field: new Set<string>(),
    dialect: new Set<string>(),
    misc: new Set<string>(),
    info: new Set<string>(),
    glossLang: new Set<string>(),
    glossGender: new Set<string>(),
    glossType: new Set<string>(),
  };

  const anyTypeSamples = {
    related: [] as Record<string, unknown>[],
    antonym: [] as Record<string, unknown>[],
    languageSource: [] as Record<string, unknown>[],
  };

  const maxSamplesPerType = 20;

  let processedCount = 0;
  let hasMore = true;
  let lastId: string | undefined;
  let batchNumber = 0;

  // 전체 개수 가져오기
  const totalCount = await jmdictEntriesRepository.getStoredCount();

  devLog(`Starting analysis of ${totalCount} entries...`);

  while (hasMore) {
    batchNumber++;
    const { entries, lastId: newLastId, hasMore: more } = await jmdictEntriesRepository.getAllEntriesPaginated(batchSize, lastId);

    // 각 엔트리 분석
    entries.forEach((entry) => {
      analyzeEntry(entry, enumSets, anyTypeSamples, maxSamplesPerType);
    });

    processedCount += entries.length;
    hasMore = more;
    lastId = newLastId || undefined;

    devLog(
      `Batch ${batchNumber}: Processed ${processedCount}/${totalCount} entries (${((processedCount / totalCount) * 100).toFixed(1)}%)`,
    );
  }

  // Set을 배열로 변환하고 정렬
  const enums = {
    kanjiTags: Array.from(enumSets.kanjiTags).sort(),
    kanaTags: Array.from(enumSets.kanaTags).sort(),
    partOfSpeech: Array.from(enumSets.partOfSpeech).sort(),
    field: Array.from(enumSets.field).sort(),
    dialect: Array.from(enumSets.dialect).sort(),
    misc: Array.from(enumSets.misc).sort(),
    info: Array.from(enumSets.info).sort(),
    glossLang: Array.from(enumSets.glossLang).sort(),
    glossGender: Array.from(enumSets.glossGender)
      .filter((v) => v)
      .sort(), // null 제거
    glossType: Array.from(enumSets.glossType)
      .filter((v) => v)
      .sort(), // null 제거
  };

  // TypeScript 코드 생성
  const generatedCode = generateTypeScriptCode(enums, anyTypeSamples);

  return {
    totalEntries: processedCount,
    enums,
    anyTypes: anyTypeSamples,
    generatedCode,
  };
}

function analyzeEntry(
  entry: JmdictEntity,
  enumSets: Record<string, Set<string>>,
  anyTypeSamples: Record<string, Record<string, unknown>[]>,
  maxSamples: number,
) {
  // kanji tags 수집
  entry.kanji.forEach((kanji) => {
    kanji.tags.forEach((tag) => enumSets.kanjiTags.add(tag));
  });

  // kana tags 수집
  entry.kana.forEach((kana) => {
    kana.tags.forEach((tag) => enumSets.kanaTags.add(tag));
  });

  // sense 분석
  entry.sense.forEach((sense) => {
    // partOfSpeech
    sense.partOfSpeech.forEach((pos) => enumSets.partOfSpeech.add(pos));

    // field
    sense.field.forEach((f) => enumSets.field.add(f));

    // dialect
    sense.dialect.forEach((d) => enumSets.dialect.add(d));

    // misc
    sense.misc.forEach((m) => enumSets.misc.add(m));

    // info
    sense.info.forEach((i) => enumSets.info.add(i));

    // gloss
    sense.gloss.forEach((gloss) => {
      enumSets.glossLang.add(gloss.lang);
      if (gloss.gender) enumSets.glossGender.add(gloss.gender);
      if (gloss.type) enumSets.glossType.add(gloss.type);
    });

    // z.any() 타입들의 샘플 수집
    if (sense.related.length > 0 && anyTypeSamples.related.length < maxSamples) {
      sense.related.forEach((rel) => {
        if (anyTypeSamples.related.length < maxSamples) {
          anyTypeSamples.related.push(rel);
        }
      });
    }

    if (sense.antonym.length > 0 && anyTypeSamples.antonym.length < maxSamples) {
      sense.antonym.forEach((ant) => {
        if (anyTypeSamples.antonym.length < maxSamples) {
          anyTypeSamples.antonym.push(ant);
        }
      });
    }

    if (sense.languageSource.length > 0 && anyTypeSamples.languageSource.length < maxSamples) {
      sense.languageSource.forEach((ls) => {
        if (anyTypeSamples.languageSource.length < maxSamples) {
          anyTypeSamples.languageSource.push(ls);
        }
      });
    }
  });
}

function generateTypeScriptCode(enums: Record<string, string[]>, anyTypeSamples: Record<string, Record<string, unknown>[]>): string {
  const lines: string[] = [];

  lines.push("import z from 'zod';");
  lines.push('');
  lines.push('// ========================================');
  lines.push('// Enum Definitions');
  lines.push('// ========================================');
  lines.push('');

  // Enum 생성
  const enumDefinitions = [
    { name: 'JmdictKanjiTag', values: enums.kanjiTags, description: 'Kanji tags' },
    { name: 'JmdictKanaTag', values: enums.kanaTags, description: 'Kana tags' },
    { name: 'JmdictPartOfSpeech', values: enums.partOfSpeech, description: 'Part of speech' },
    { name: 'JmdictField', values: enums.field, description: 'Field of application' },
    { name: 'JmdictDialect', values: enums.dialect, description: 'Dialect' },
    { name: 'JmdictMisc', values: enums.misc, description: 'Miscellaneous information' },
    { name: 'JmdictInfo', values: enums.info, description: 'Additional information' },
    { name: 'JmdictGlossLang', values: enums.glossLang, description: 'Gloss language' },
    { name: 'JmdictGlossGender', values: enums.glossGender, description: 'Gloss gender' },
    { name: 'JmdictGlossType', values: enums.glossType, description: 'Gloss type' },
  ];

  enumDefinitions.forEach(({ name, values, description }) => {
    if (values.length === 0) {
      lines.push(`// ${name}: No values found`);
      lines.push(`export const ${name}Schema = z.string();`);
    } else {
      lines.push(`// ${description}`);
      lines.push(`export const ${name}Schema = z.enum([`);
      values.forEach((value, index) => {
        const isLast = index === values.length - 1;
        lines.push(`  '${value}'${isLast ? '' : ','}`);
      });
      lines.push(`]);`);
    }
    lines.push(`export type ${name} = z.infer<typeof ${name}Schema>;`);
    lines.push('');
  });

  lines.push('// ========================================');
  lines.push('// z.any() Type Analysis');
  lines.push('// ========================================');
  lines.push('');
  lines.push('// Sample data for related, antonym, and languageSource fields:');
  lines.push('// You need to manually analyze these samples and create appropriate schemas');
  lines.push('');
  lines.push('// Related samples:');
  lines.push(`// ${JSON.stringify(anyTypeSamples.related.slice(0, 5), null, 2)}`);
  lines.push('');
  lines.push('// Antonym samples:');
  lines.push(`// ${JSON.stringify(anyTypeSamples.antonym.slice(0, 5), null, 2)}`);
  lines.push('');
  lines.push('// LanguageSource samples:');
  lines.push(`// ${JSON.stringify(anyTypeSamples.languageSource.slice(0, 5), null, 2)}`);
  lines.push('');
  lines.push('// For now, keeping z.any() but you can replace with proper schemas:');
  lines.push('// export const JmdictRelatedSchema = z.object({ ... });');
  lines.push('// export const JmdictAntonymSchema = z.object({ ... });');
  lines.push('// export const JmdictLanguageSourceSchema = z.object({ ... });');
  lines.push('');

  lines.push('// ========================================');
  lines.push('// Updated Schemas');
  lines.push('// ========================================');
  lines.push('');

  lines.push('export const JmdictGlossSchema = z.object({');
  lines.push('  lang: JmdictGlossLangSchema,');
  lines.push('  gender: JmdictGlossGenderSchema.nullable(),');
  lines.push('  type: JmdictGlossTypeSchema.nullable(),');
  lines.push('  text: z.string(),');
  lines.push('});');
  lines.push('');

  lines.push('export const JmdictKanjiSchema = z.object({');
  lines.push('  common: z.boolean(),');
  lines.push('  text: z.string(),');
  lines.push('  tags: z.array(JmdictKanjiTagSchema),');
  lines.push('});');
  lines.push('');

  lines.push('export const JmdictKanaSchema = z.object({');
  lines.push('  common: z.boolean(),');
  lines.push('  text: z.string(),');
  lines.push('  tags: z.array(JmdictKanaTagSchema),');
  lines.push('  appliesToKanji: z.array(z.string()),');
  lines.push('});');
  lines.push('');

  lines.push('export const JmdictSenseSchema = z.object({');
  lines.push('  partOfSpeech: z.array(JmdictPartOfSpeechSchema),');
  lines.push('  appliesToKanji: z.array(z.string()),');
  lines.push('  appliesToKana: z.array(z.string()),');
  lines.push('  related: z.array(z.any()), // TODO: Replace with proper schema after analyzing samples');
  lines.push('  antonym: z.array(z.any()), // TODO: Replace with proper schema after analyzing samples');
  lines.push('  field: z.array(JmdictFieldSchema),');
  lines.push('  dialect: z.array(JmdictDialectSchema),');
  lines.push('  misc: z.array(JmdictMiscSchema),');
  lines.push('  info: z.array(JmdictInfoSchema),');
  lines.push('  languageSource: z.array(z.any()), // TODO: Replace with proper schema after analyzing samples');
  lines.push('  gloss: z.array(JmdictGlossSchema),');
  lines.push('});');
  lines.push('');

  lines.push('export const JmdictEntrySchema = z.object({');
  lines.push('  id: z.string(),');
  lines.push('  kanji: z.array(JmdictKanjiSchema),');
  lines.push('  kana: z.array(JmdictKanaSchema),');
  lines.push('  sense: z.array(JmdictSenseSchema),');
  lines.push('});');
  lines.push('');

  lines.push('export type JmdictGloss = z.infer<typeof JmdictGlossSchema>;');
  lines.push('export type JmdictKanji = z.infer<typeof JmdictKanjiSchema>;');
  lines.push('export type JmdictKana = z.infer<typeof JmdictKanaSchema>;');
  lines.push('export type JmdictSense = z.infer<typeof JmdictSenseSchema>;');
  lines.push('export type JmdictEntry = z.infer<typeof JmdictEntrySchema>;');

  return lines.join('\n');
}
