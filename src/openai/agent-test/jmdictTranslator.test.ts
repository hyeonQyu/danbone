import { JmdictTranslationSchema, TextsSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type JmdictTranslationInput = z.infer<typeof JmdictTranslationSchema>;
type JmdictTranslationOutput = z.infer<typeof TextsSchema>;

type JmdictTranslatorTestCase = Omit<TestCase<JmdictTranslationOutput>, 'input'> & {
  input: JmdictTranslationInput;
};

export const jmdictTranslatorTestCases: JmdictTranslatorTestCase[] = [
  // ===== 取りあえず (とりあえず) - sense 1 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['取りあえず', '取り敢えず', '取敢えず', '取り合えず', '取合えず'],
      kanas: ['とりあえず'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'first of all',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'at once',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'right away',
        },
      ],
    },
    expectedOutput: { texts: ['우선', '즉시', '바로'] },
    description: '取りあえず - sense 1 (urgency): first of all, at once, right away',
  },

  // ===== 取りあえず (とりあえず) - sense 2 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['取りあえず', '取り敢えず', '取敢えず', '取り合えず', '取合えず'],
      kanas: ['とりあえず'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'for now',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'for the time being',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'tentatively',
        },
      ],
    },
    expectedOutput: { texts: ['일단', '당분간', '잠정적으로'] },
    description: '取りあえず - sense 2 (temporary): for now, for the time being, tentatively',
  },

  // ===== 取りあえず (とりあえず) - sense 3 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['取りあえず', '取り敢えず', '取敢えず', '取り合えず', '取合えず'],
      kanas: ['とりあえず'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'anyway',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'at least',
        },
      ],
    },
    expectedOutput: { texts: ['어쨌든', '적어도'] },
    description: '取りあえず - sense 3: anyway, at least',
  },

  // ===== 責任 (せきにん) - sense 1 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['責任'],
      kanas: ['せきにん'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'duty',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'responsibility (incl. supervision of staff)',
        },
      ],
    },
    expectedOutput: { texts: ['의무', '책임'] },
    description: '責任 - sense 1: duty, responsibility',
  },

  // ===== 責任 (せきにん) - sense 2 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['責任'],
      kanas: ['せきにん'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'liability',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'onus',
        },
      ],
    },
    expectedOutput: { texts: ['책임', '부담'] },
    description: '責任 - sense 2: liability, onus',
  },

  // ===== 面倒 (めんどう) - sense 1 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['面倒'],
      kanas: ['めんどう'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'trouble',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'bother',
        },
      ],
    },
    expectedOutput: { texts: ['귀찮음', '번거로움'] },
    description: '面倒 - sense 1 (bothersome): trouble, bother',
  },

  // ===== 面倒 (めんどう) - sense 2 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['面倒'],
      kanas: ['めんどう'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'trouble',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'difficulty',
        },
      ],
    },
    expectedOutput: { texts: ['곤란', '어려움'] },
    description: '面倒 - sense 2 (difficult): trouble, difficulty',
  },

  // ===== 面倒 (めんどう) - sense 3 =====
  {
    input: {
      sourceLanguage: 'ko',
      kanjis: ['面倒'],
      kanas: ['めんどう'],
      glosses: [
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'care',
        },
        {
          lang: 'eng',
          gender: null,
          type: null,
          text: 'attention',
        },
      ],
    },
    expectedOutput: { texts: ['보살핌', '관심'] },
    description: '面倒 - sense 3 (care): care, attention',
  },
];
