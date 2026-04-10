import { buildAgentFactory } from '@/openai/agent.utils';
import { MorphologicalAnalysisResultSchema } from '@/openai/schemes';

const gpt5Instructions = `
Analyze Japanese text and extract morphemes with base forms.

Rules:
- Split text into tokens (words, particles, auxiliaries)
- Exclude punctuation (。？！、?, !, . etc.)
- surface: exact form in text
- base: dictionary form (食べた→食べる, 高かった→高い, います→いる, です→だ, 歩きます→歩く)

Output: { "tokens": [{ "surface": "...", "base": "..." }] }`;

const gpt41Instructions = `
Analyze Japanese text and extract morphemes with their base forms.

Input: Japanese text (word, phrase, or sentence)

CRITICAL RULE: DO NOT include punctuation marks in the output tokens!
Punctuation marks to exclude: 。, ？, ！, 、, ?, !, .

STEP 1: Tokenization
- Split text into meaningful units (words, particles, auxiliaries)
- Common particles: は, が, を, に, で, と, から, まで, の, へ, や, か
- REMOVE all punctuation marks from tokens

STEP 2: Base form conversion
- Verbs: Convert to dictionary form (う-ending)
  * ます形 → dictionary: 歩きます → 歩く, 食べます → 食べる, 泳ぎます → 泳ぐ
  * た形 → dictionary: 買った → 買う, 食べた → 食べる, 売った → 売る
  * て形 → dictionary: 食べて → 食べる, 歩いて → 歩く
  * ない形 → dictionary: 分からない → 分かる, 知らない → 知る, 食べません → 食べる
  * Volitional: 遊ぼう → 遊ぶ, 行こう → 行く, 勉強しましょう → 勉強する
  * Command: 止まれ → 止まる, 黙れ → 黙る, 出ろ → 出る
  * Progressive: 知っています → 知る, 住んでる → 住む
- Adjectives:
  * い-adjectives: Use base form (高い, 新しい)
  * Past forms: 高かった → 高い
  * Adverbial: 早く → 早い
- Copula: です → だ
- Particles/Adverbs/Nouns: Keep as-is

STEP 3: Output format
{ "tokens": [{ "surface": "<as written>", "base": "<dictionary form>" }] }
IMPORTANT: Tokens array should NOT contain any punctuation marks!

Examples:
- Input: "昨日本を読んだ" → Output: { "tokens": [{"surface": "昨日", "base": "昨日"}, {"surface": "本", "base": "本"}, {"surface": "を", "base": "を"}, {"surface": "読んだ", "base": "読む"}] }
- Input: "毎日会社に行きます" → Output: { "tokens": [{"surface": "毎日", "base": "毎日"}, {"surface": "会社", "base": "会社"}, {"surface": "に", "base": "に"}, {"surface": "行きます", "base": "行く"}] }
- Input: "帰るの?" → Output: { "tokens": [{"surface": "帰る", "base": "帰る"}, {"surface": "の", "base": "の"}] } (? is excluded!)
- Input: "分かりますか?" → Output: { "tokens": [{"surface": "分かります", "base": "分かる"}, {"surface": "か", "base": "か"}] } (? is excluded!)`;

export const jaMorphologicalAnalyzerAgentFactory = buildAgentFactory(
  {
    name: 'Japanese morphological analyzer',
    outputType: MorphologicalAnalysisResultSchema,
  },
  [
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
      id: 'gpt5-mini-reasoning-minimal',
      label: 'GPT-5 Mini (reasoning: minimal)',
      model: 'gpt-5-mini',
      instructions: gpt5Instructions,
      modelSettings: {
        reasoning: { effort: 'minimal' },
      },
    },
    {
      id: 'gpt-4.1-mini',
      label: 'GPT-4.1 Mini',
      model: 'gpt-4.1-mini',
      instructions: gpt41Instructions,
    },
    {
      id: 'gpt-4o-mini',
      label: 'GPT-4o Mini',
      model: 'gpt-4o-mini',
      instructions: gpt41Instructions,
    },
  ] as const,
);
