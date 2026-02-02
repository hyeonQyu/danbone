import { buildAgentFactory } from '@/openai/agent.utils';
import { validatorSchema } from '@/openai/schemes';

export const searchInputGuardrailAgentFactory = buildAgentFactory(
  {
    name: 'Search input guardrail',
    outputType: validatorSchema,
  },
  {
    'gpt-5-nano': {
      instructions: `
      Validate if input language is Korean, Japanese, English, or Japanese transcribed in Hangul.
      
      Accept simple typos. Reject meaningless character combinations that look like Japanese but aren't real words.
  
      Invalid: Chinese, other languages, non-Japanese words in Hangul, or fake Japanese-like text.
  
      Output: { "valid": true } or { "valid": false }`,
    },
    'gpt-4o-mini': {
      instructions: `
      Validate if the input is written in Korean, Japanese, English, or Japanese transcribed in Hangul.

      VALID (return valid: true):
      - Korean: Any text using Hangul characters (가나다) or Korean Hanja
      - Japanese: Any text using Hiragana (あいう), Katakana (アイウ), or Kanji
      - English: Any text using Latin alphabet (ABC)
      - Japanese in Hangul: Japanese words written using Korean alphabet
        Examples: "아리가또", "곤니찌와", "사요나라", "고멘나사이", "오하요"
      - Simple typos in valid languages: "안녕하세욧", "こんにちわ", "thnak you"

      INVALID (return valid: false):
      - Chinese: Simplified/Traditional characters (你好, 謝謝)
      - Other European languages: French, German, Spanish, Italian
      - Other scripts: Russian, Arabic, Thai, etc.
      - Non-Japanese words in Hangul: "니하오" (Chinese), "봉주르" (French)
      - Fake Japanese-like text: Meaningless combinations like "ぎゃらぷす", "カタガナバボ"

      Edge cases:
      - Empty input → valid: false
      - Mixed Korean + Chinese (non-Hanja) → valid: false
      - English + other scripts (except Korean/Japanese) → valid: false

      Output: { "valid": true } or { "valid": false }`,
    },
    'gpt-4.1-mini': {
      instructions: `
      Determine if the input text is written in an acceptable language.

      Acceptable languages:
      1. Korean (한국어) - Hangul-based text
      2. Japanese (日本語) - Hiragana, Katakana, or Kanji (including multi-character phrases with spaces like "渋谷 カフェ")
      3. English - Latin alphabet
      4. Japanese transcribed in Hangul - Japanese vocabulary/phrases written using Korean letters

      CRITICAL: Kanji character distinction:
      - Japanese Kanji (日本, 学校, 勉強, 渋谷, 東京, 寿司) → VALID
      - When uncertain, if Kanji could be used in Japanese context → treat as VALID

      Recognition patterns for text using only Hangul:
      Step 1: Is this Korean text (actual Korean words/vocabulary)? → VALID
      Step 2: If not Korean, is this Japanese transcribed in Hangul? → VALID
      Step 3: If neither, it's a non-Korean, non-Japanese language transcribed in Hangul → INVALID

      Examples for Hangul-only text:
      - "안녕하세요" → Korean word → VALID
      - "아리가또" → Japanese (ありがとう) transcribed → VALID
      - "니하오" → Chinese (你好) transcribed → INVALID
      - "봉주르" → French (Bonjour) transcribed → INVALID

      For other scripts:
      - Text using Japanese scripts (Hiragana/Katakana/Kanji): valid even with spaces between words
      - Mixed scripts: valid ONLY if all parts are from acceptable languages

      Typo handling:
      - Accept simple typos in valid languages (e.g., "안녕하세욧", "こんにちわ", "おはよー", "thnak you")
      - These are still recognizable as Korean/Japanese/English despite minor spelling errors

      Fake Japanese detection:
      - Reject meaningless character combinations that use Japanese scripts but form no real words
      - Examples of INVALID fake Japanese: "ぎゃらぷす", "カタガナバボ"

      All other languages (Chinese, French, Russian, etc.) → INVALID`,
    },
  },
);
