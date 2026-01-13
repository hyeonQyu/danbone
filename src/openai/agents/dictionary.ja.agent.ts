import { buildAgentFactory } from '@/openai/agent.utils';
// @deprecated - jmdict 사용으로 deprecated
// import { DictionaryOutputSchemaByLanguage } from '@/openai/schemes';
import { DictionaryEntrySchemaByLanguage } from '@/features/dictionary/dictionary.types';
import z from 'zod';

// Deprecated: Word 구조가 제거되었으므로 임시로 정의
const DictionaryOutputSchemaByLanguage = {
  ja: z.object({
    words: z.array(
      z.object({
        keyword: z.string(),
        entries: z.array(DictionaryEntrySchemaByLanguage.ja),
      }),
    ),
  }),
};

const gpt5Instructions = `
Provide dictionary information for Japanese words.

Input: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

Rules:
- notation: Standard form (Kanji for Chinese-origin, Hiragana for native, Katakana for loanwords)
- pronunciation: Hiragana only (たべる, ひろい, きる)
- meanings: 1-3 meanings in sourceLanguage (dictionary-level, not encyclopedic)
- pos: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, particle, conjunction, interjection
- examples: 1-2 natural Japanese sentences

Entry separation:
- Different POS → separate entries
- Same POS with COMPLETELY different meanings → separate entries  
- Similar meanings → one entry with meanings array

Output: { "words": [{ "keyword": "<base form>", "entries": [...] }] }`;

const gpt5SimpleInstructions = `
Provide Japanese dictionary information.

Input: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

For each word:
- notation: Standard form (食べる, 広い, カフェ)
- pronunciation: Hiragana (たべる, ひろい, かふぇ)
- meanings: 1-3 in sourceLanguage
- pos: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, particle, conjunction, interjection
- examples: 1-2 sentences

Separate entries if: different POS or completely different meanings.
Same entry if: similar/related meanings.

Output: { "words": [{ "keyword": "<base>", "entries": [...] }] }`;

const gpt4Instructions = `
Provide comprehensive dictionary information for Japanese words.

Input format: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

STEP 1: Understand the output structure
{ "words": [{ "keyword": "...", "entries": [...] }] }

- keyword: Dictionary base form (食べる, 高い, 猫)
- entries: Array containing one or more entry objects

CRITICAL: When to create MULTIPLE entries for ONE word:
1. Word has DIFFERENT parts of speech → SEPARATE entries
   Example: 上手 can be naAdjective (능숙한) AND noun (고수) → 2 entries
2. SAME part of speech but COMPLETELY DIFFERENT meanings → SEPARATE entries
   Example: 立つ can mean "서다" OR "출발하다" (both godanVerb but different) → 2 entries

When to create ONE entry with multiple meanings:
- Similar/related meanings that are variations of the same concept → ONE entry with meanings array
  Example: 嬉しい means "기쁘다" and "즐겁다" (similar concepts) → 1 entry with ["기쁘다", "즐겁다"]

STEP 2: Process each input word
For EVERY word in the input array, you MUST create a word object.

A. Determine the keyword
- Use the dictionary base form: 食べる (not 食べます), 高い (not 高かった), 猫

B. Analyze the word to determine how many entries are needed
- Count how many different POS it has
- Count how many completely different meanings exist for each POS
- Create SEPARATE entries for each combination of (POS + distinct meaning)

Example analysis:
- 猫: 1 POS (noun), 1 meaning → 1 entry
- 上手: 2 POS (naAdjective, noun) → 2 entries
- 立つ: 1 POS (godanVerb), 2 completely different meanings → 2 entries
- 嬉しい: 1 POS (iAdjective), 2 similar meanings → 1 entry with 2 meanings

STEP 3: Create each entry with these fields

1. notation (required)
   - Standard written form:
     * Kanji for Chinese-origin: 食べる, 広い, 走る
     * Hiragana for native: ひらがな, おはよう
     * Katakana for loanwords: カフェ, コーヒー

2. pronunciation (required)
   - ALWAYS in hiragana: たべる, ひろい, はしる, かふぇ

3. meanings (required, 1-3 items)
   - Provide in sourceLanguage
   - Dictionary-level meanings only (not encyclopedic)
   - For basic words: just the meaning ("먹다", "자다", "고양이")
   - Add context ONLY when truly needed for ambiguity
   - Multiple meanings in array ONLY if similar/related

4. pos (required)
   - Choose ONE: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, particle, conjunction, interjection
   - godanVerb: 5-dan verbs (書く, 飲む, 立つ, 走る)
   - ichidanVerb: 1-dan verbs (食べる, 見る, 起きる)
   - irregularVerb: する, 来る and their compounds

5. examples (required, 1-2 items)
   - Natural Japanese sentences that clearly show this specific meaning
   - Use practical, common examples

STEP 4: Detailed entry separation examples

Example 1 - Multiple POS:
Input: 上手
Analysis: This word can be BOTH naAdjective AND noun
Output:
{
  "keyword": "上手",
  "entries": [
    {
      "notation": "上手",
      "pronunciation": "じょうず",
      "meanings": ["능숙한", "잘하는"],
      "pos": "naAdjective",
      "examples": ["日本語が上手です", "料理が上手だ"]
    },
    {
      "notation": "上手",
      "pronunciation": "じょうず",
      "meanings": ["고수", "능숙한 사람"],
      "pos": "noun",
      "examples": ["彼はピアノの上手だ"]
    }
  ]
}

Example 2 - Same POS, completely different meanings:
Input: 立つ
Analysis: Same POS (godanVerb) but "서다" vs "출발하다" are COMPLETELY different
Output:
{
  "keyword": "立つ",
  "entries": [
    {
      "notation": "立つ",
      "pronunciation": "たつ",
      "meanings": ["서다"],
      "pos": "godanVerb",
      "examples": ["そこに立つ", "立って話す"]
    },
    {
      "notation": "立つ",
      "pronunciation": "たつ",
      "meanings": ["출발하다", "떠나다"],
      "pos": "godanVerb",
      "examples": ["電車が立つ", "駅を立つ"]
    }
  ]
}

Example 3 - Similar meanings in one entry:
Input: 嬉しい
Analysis: "기쁘다" and "즐겁다" are similar emotional states
Output:
{
  "keyword": "嬉しい",
  "entries": [
    {
      "notation": "嬉しい",
      "pronunciation": "うれしい",
      "meanings": ["기쁘다", "즐겁다"],
      "pos": "iAdjective",
      "examples": ["嬉しいニュース", "とても嬉しいです"]
    }
  ]
}

STEP 5: Process ALL input words and format output
- Create a word object for EVERY word in input
- Each word object has keyword and entries array
- Put all word objects in the words array
- Output: { "words": [word1, word2, ...] }

VERIFICATION CHECKLIST before returning:
□ Did I create entries for ALL words in the input?
□ Did I separate entries when POS is different?
□ Did I separate entries when same POS has completely different meanings?
□ Did I keep similar meanings in one entry?
□ Does each entry have ALL 5 required fields?
□ Are examples relevant to the specific meaning in that entry?`;

/**
 * @deprecated jmdict 사용으로 deprecated 처리
 */
export const jaDictionaryAgentFactory = buildAgentFactory(
  {
    name: 'Japanese Dictionary',
    outputType: DictionaryOutputSchemaByLanguage.ja,
  },
  [
    // GPT-5 Nano (3 models)
    {
      id: 'gpt5-nano-reasoning-low',
      label: 'GPT-5 Nano (reasoning: low)',
      model: 'gpt-5-nano',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt5-nano-reasoning-medium',
      label: 'GPT-5 Nano (reasoning: medium)',
      model: 'gpt-5-nano',
      instructions: gpt5SimpleInstructions,
      modelSettings: {
        reasoning: { effort: 'medium' },
      },
    },
    {
      id: 'gpt5-nano-reasoning-high',
      label: 'GPT-5 Nano (reasoning: high)',
      model: 'gpt-5-nano',
      instructions: gpt5SimpleInstructions,
      modelSettings: {
        reasoning: { effort: 'high' },
      },
    },

    // GPT-5 Mini (3 models)
    {
      id: 'gpt5-mini-reasoning-low',
      label: 'GPT-5 Mini (reasoning: low)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt5-mini-reasoning-medium',
      label: 'GPT-5 Mini (reasoning: medium)',
      model: 'gpt-5-mini',
      instructions: gpt5SimpleInstructions,
      modelSettings: {
        reasoning: { effort: 'medium' },
      },
    },
    {
      id: 'gpt5-mini-reasoning-high',
      label: 'GPT-5 Mini (reasoning: high)',
      model: 'gpt-5-mini',
      instructions: gpt5SimpleInstructions,
      modelSettings: {
        reasoning: { effort: 'high' },
      },
    },

    // GPT-4.1 Mini
    {
      id: 'gpt-4.1-mini-detailed',
      label: 'GPT-4.1 Mini (detailed)',
      model: 'gpt-4.1-mini',
      instructions: gpt4Instructions,
    },
    {
      id: 'gpt-4.1-mini-simple',
      label: 'GPT-4.1 Mini (simple)',
      model: 'gpt-4.1-mini',
      instructions: gpt5SimpleInstructions,
    },

    // GPT-4o Mini
    {
      id: 'gpt-4o-mini-detailed',
      label: 'GPT-4o Mini (detailed)',
      model: 'gpt-4o-mini',
      instructions: gpt4Instructions,
    },
    {
      id: 'gpt-4o-mini-simple',
      label: 'GPT-4o Mini (simple)',
      model: 'gpt-4o-mini',
      instructions: gpt5SimpleInstructions,
    },
  ] as const,
);
