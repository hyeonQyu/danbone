import { buildAgentFactory } from '@/openai/agent.utils';
import { TextsSchema } from '@/openai/schemes';

const gpt5Instructions = `
Translate text naturally while preserving formality and meaning.

CRITICAL RULE: ALL translations MUST match the input's formality level exactly.
- Casual input (e.g., 고마워, ありがとう, ある, いる, thanks) → ONLY casual translations
- Formal input (e.g., 감사합니다, ありがとうございます, あります, います, thank you) → ONLY formal translations
- NEVER mix formality levels in the output (e.g., ある and います cannot be together)

Other principles:
- Provide variations when meanings differ OR nuances/contexts differ (e.g., ある vs いる, ちょっと vs 少し)
- Do NOT provide variations just for formality differences (e.g., ある vs あります)
- Exclude rare or uncommon expressions
- Limit: words ≤5 variations, phrases/sentences ≤3 variations

Output: { "texts": ["translation1", "translation2", ...] }`;

const gpt5SimpleInstructions = `
Translate naturally while maintaining formality and meaning.

CRITICAL: ALL translations MUST be at the SAME formality level as input.
- Casual input (있다, ある, いる) → ONLY casual output
- Formal input (있습니다, あります, います) → ONLY formal output
- NEVER mix formality levels (e.g., ある + います is WRONG)

Rules:
- Provide variations for different meanings or nuances (e.g., ある vs いる, ちょっと vs 少し)
- Do NOT provide variations for formality only (e.g., ある vs あります)
- Use common, natural expressions
- Limits: words ≤5, phrases ≤3 variations

Output: { "texts": ["translation1", ...] }`;

const gpt4oInstructions = `
Translate naturally while maintaining the EXACT formality level.

Input: { "text": "...", "sourceLanguage": "...", "targetLanguage": "..." }

CRITICAL RULE: ALL outputs MUST be at the SAME formality level as input.

Formality detection:
- Korean: 반말 (-다, 고마워) vs 존댓말 (-요/-습니다, 감사합니다)
- Japanese: plain forms (ある, いる, 食べる, いい) vs です/ます forms (あります, います, 食べます, いいです)
- English: casual (thanks, I'm) vs formal (thank you, I am)

FORBIDDEN - Never mix these:
❌ ある + います (mixed casual + polite)
❌ 食べる + 食べます (mixed casual + polite)
❌ 좋다 + 좋아요 (mixed casual + polite)

CORRECT - Same formality, different meanings:
✓ ある + いる (both casual/plain)
✓ あります + います (both polite)
✓ 住む + 生きる (both casual/plain)

Before output, verify:
- Japanese: ALL plain (食べる, ある) OR ALL です/ます (食べます, あります)?
- Korean: ALL -다 OR ALL -요/-습니다?
- If mixed → REMOVE the wrong formality!

Provide multiple translations ONLY when:
- Different meanings (e.g., 살다 = 住む vs 生きる)
- Different nuances but SAME formality (e.g., 많이 = たくさん vs いっぱい)
NOT for different formality of same word!

Output: { "texts": ["translation1", "translation2", ...] }
Limit: words ≤5, phrases ≤3`;

const gpt41Instructions = `
Translate text from source language to target language naturally.

Input format: { "text": "...", "sourceLanguage": "...", "targetLanguage": "..." }

CRITICAL RULE: FORMALITY LEVEL CONSISTENCY
ALL translations in the output MUST be at the EXACT SAME formality level as the input.
- If input is casual → ALL outputs MUST be casual
- If input is formal → ALL outputs MUST be formal
- NEVER EVER mix casual and formal translations in the same output

STEP 1: Analyze formality level
- Carefully check if input is casual/informal or polite/formal
- Each language has its own formality markers:
  * English: contractions, slang vs formal vocabulary
  * French: tu vs vous
  * Spanish: tú vs usted
  * German: du vs Sie
  * Korean: 반말 (고마워, 미안해) vs 존댓말 (고마워요, 감사합니다)
  * Japanese: casual forms (ありがとう, ごめん) vs です/ます forms (ありがとうございます, すみません)

STEP 2: Translate to the SAME formality level
- If input is casual → provide ONLY casual translations
- If input is polite → provide ONLY polite translations
- DO NOT mix formality levels - this is the most important rule
- Examples of WRONG outputs:
  * Input: "고마워" (casual) → ❌ WRONG: ["ありがとう", "ありがとうございます"] (mixed formality)
  * Input: "고마워" (casual) → ✓ CORRECT: ["ありがとう"] (all casual)
  * Input: "감사합니다" (formal) → ❌ WRONG: ["ありがとう", "ありがとうございます"] (mixed formality)
  * Input: "감사합니다" (formal) → ✓ CORRECT: ["ありがとうございます"] (all formal)
  * Input: "있다" (casual) → ❌ WRONG: ["ある", "います"] (います is polite form!)
  * Input: "있다" (casual) → ✓ CORRECT: ["ある", "いる"] (both are casual forms)
  * Input: "조금" (casual) → ✓ CORRECT: ["ちょっと", "少し"] (different nuances, both casual)

STEP 3: Determine if multiple translations are needed
- Provide multiple translations when:
  * Different meanings exist (e.g., "bank" = financial institution OR river bank)
  * Different contexts require different words (e.g., "있다" = ある [for inanimate objects] OR いる [for animate beings])
  * Different nuances or usage contexts (e.g., "조금" = ちょっと [more colloquial] vs 少し [more neutral])
  * Target language has multiple common ways to express the same concept
- DO NOT provide multiple translations for:
  * Same meaning with different formality levels (e.g., "thanks" vs "thank you", ある vs あります, 고마워 vs 감사합니다)
  * Perfect synonyms with no meaningful difference in usage

STEP 4: Quality check
- Double-check that ALL translations are at the SAME formality level
- For Japanese verbs/adjectives: Verify conjugation forms
  * Casual input → dictionary/plain forms (ある, いる, だ, である)
  * Polite input → です/ます forms (あります, います, です)
- For Korean: Verify sentence endings
  * Casual input → 반말 endings (있다, 하다, -어/아)
  * Polite input → 존댓말 endings (있어요, 있습니다, 해요, 합니다)
- Preserve the original meaning and nuance
- Use natural, commonly-used expressions
- Exclude uncommon, rare, or archaic expressions
- Apply limits strictly:
  * For words: maximum 5 variations
  * For phrases/sentences: maximum 3 variations

STEP 5: Format output
Output format: { "texts": ["translation1", "translation2", ...] }
- Return only the texts array
- ALL texts must be at the same formality level
- Order translations from most common to less common`;

export const translatorAgentFactory = buildAgentFactory(
  {
    name: 'Translator',
    outputType: TextsSchema,
  },
  [
    {
      id: 'gpt-5-mini-reasoning',
      label: 'GPT-5 Mini (Reasoning)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'medium' },
      },
    },
    {
      id: 'gpt-5-mini',
      label: 'GPT-5 Mini',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
    },
    {
      id: 'gpt-5-nano-reasoning',
      label: 'GPT-5 Nano (Reasoning)',
      model: 'gpt-5-nano',
      instructions: gpt5SimpleInstructions,
      modelSettings: {
        reasoning: { effort: 'low' },
      },
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      model: 'gpt-4o-mini',
      instructions: gpt4oInstructions,
    },
    {
      id: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      model: 'gpt-4.1-mini',
      instructions: gpt41Instructions,
    },
  ] as const,
);
