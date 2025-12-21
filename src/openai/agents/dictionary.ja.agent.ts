import { buildAgentFactory } from '@/openai/agent.utils';
import { DictionaryOutputSchemaByLanguage } from '@/openai/schemes';

export const jaDictionaryAgentFactory = buildAgentFactory(
  {
    name: 'Japanese Dictionary',
    outputType: DictionaryOutputSchemaByLanguage.ja,
  },
  {
    // 'gpt-5-mini': {
    //   instructions: `
    //   Provide dictionary information for Japanese words.

    //   Input: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

    //   Output: { "entries": [...] }

    //   For each word in entries array, return:
    //   - keyword: the input word
    //   - results: array of dictionary entries (separate by part of speech)
    //     - notation: word notation (kanji, hiragana, or katakana)
    //     - pronunciation: hiragana pronunciation
    //     - meanings: 1-3 meanings in source language (separate if completely different meanings with same POS)
    //     - pos: part of speech (godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection)
    //     - examples: 1-2 practical example sentences in Japanese

    //   Important:
    //   - If a word has multiple parts of speech, create separate result entries
    //   - If same POS has completely different meanings, create separate entries
    //   - Keep examples natural and commonly used in daily life`,
    // },
    'gpt-5-nano': {
      instructions: `
      Provide dictionary information for Japanese words.
      
      Input: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }
      
      Output: { "entries": [...] }
      
      For each word in entries array, return:
      - keyword: the input word
      - results: array of dictionary entries (separate by part of speech)
        - notation: word notation (kanji, hiragana, or katakana)
        - pronunciation: hiragana pronunciation
        - meanings: 1-3 meanings in source language (separate if completely different meanings with same POS)
        - pos: part of speech (godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection)
        - examples: 1-2 practical example sentences in Japanese
      
      Important:
      - If a word has multiple parts of speech, create separate result entries
      - If same POS has completely different meanings, create separate entries
      - Keep examples natural and commonly used in daily life`,
    },
    //   'gpt-4.1-mini': {
    //     instructions: `
    //     Provide detailed dictionary information for Japanese words with rich explanations and context.

    //     Input format: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

    //     Output format example:
    //     {
    //       "entries": [
    //         {
    //           "keyword": "広い",
    //           "results": [
    //             {
    //               "notation": "広い",
    //               "pronunciation": "ひろい",
    //               "meanings": [
    //                 "넓다; 공간·면적이 크다",
    //                 "범위가 넓다; 폭넓다, 다양하다",
    //                 "(비유적으로) 선택지·범위 등이 많다"
    //               ],
    //               "pos": "iAdjective",
    //               "examples": [
    //                 "この公園はとても広い。",
    //                 "選択肢が広いので、いろいろ試せます。"
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "食べる",
    //           "results": [
    //             {
    //               "notation": "食べる",
    //               "pronunciation": "たべる",
    //               "meanings": ["먹다; 음식물을 입으로 섭취하다"],
    //               "pos": "ichidanVerb",
    //               "examples": ["ご飯を食べる", "朝ごはんを食べました"]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "上手",
    //           "results": [
    //             {
    //               "notation": "上手",
    //               "pronunciation": "じょうず",
    //               "meanings": ["능숙한, 잘하는; 어떤 일을 잘 수행하는"],
    //               "pos": "naAdjective",
    //               "examples": ["日本語が上手です", "料理が上手だ"]
    //             },
    //             {
    //               "notation": "上手",
    //               "pronunciation": "じょうず",
    //               "meanings": ["고수, 능숙한 사람; 어떤 분야에 뛰어난 사람"],
    //               "pos": "noun",
    //               "examples": ["彼はピアノの上手だ"]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "切る",
    //           "results": [
    //             {
    //               "notation": "切る",
    //               "pronunciation": "きる",
    //               "meanings": ["자르다; 칼이나 가위 등으로 나누다"],
    //               "pos": "godanVerb",
    //               "examples": ["紙を切る", "野菜を切る"]
    //             },
    //             {
    //               "notation": "切る",
    //               "pronunciation": "きる",
    //               "meanings": ["끊다, 끝내다; 연결이나 작동을 중단하다"],
    //               "pos": "godanVerb",
    //               "examples": ["電話を切る", "電源を切る"]
    //             }
    //           ]
    //         }
    //       ]
    //     }

    //     Detailed Rules:
    //     1. notation: Write in standard form
    //        - Kanji for Chinese-origin words (食べる, 広い, 切る)
    //        - Hiragana for native words (ひらがな)
    //        - Katakana for loanwords (カフェ, コーヒー)

    //     2. pronunciation: Always in hiragana (たべる, ひろい, きる)

    //     3. meanings: Provide 1-3 meanings in the source language with brief helpful context
    //        - Add concise explanations after semicolons (keep it simple and practical)
    //        - Examples: "기쁘다; 좋은 일이 생겨 마음이 즐거운 상태", "넓다; 공간이나 면적이 큰", "달리다; 빠르게 뛰다"
    //        - For nuanced words: "つまらない; 재미없거나 시시한", "切る; 도구로 나누다 / 연결을 끊다"
    //        - If same POS has COMPLETELY different meanings (like 切る: cut vs. disconnect), separate into different result entries
    //        - If meanings are similar/related variations, keep in one entry as an array

    //     4. pos: Choose from: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection

    //     5. examples: 1-2 natural, commonly used sentences that clearly demonstrate the meaning

    //     6. If a word has multiple parts of speech, create separate result entries for each POS with appropriate explanations

    //     IMPORTANT: Add brief, helpful context to meanings (not overly detailed), just enough to clarify the nuance or usage situation.

    //     Process ALL words in the input array and return results for each in the entries array.`,
    //   },
    //   'gpt-4.1-nano': {
    //     instructions: `
    //     Provide detailed dictionary information for Japanese words with rich explanations and context.

    //     Input format: { "sourceLanguage": "<language>", "words": ["word1", "word2", ...] }

    //     Output format example:
    //     {
    //       "entries": [
    //         {
    //           "keyword": "広い",
    //           "results": [
    //             {
    //               "notation": "広い",
    //               "pronunciation": "ひろい",
    //               "meanings": [
    //                 "넓다; 공간·면적이 크다",
    //                 "범위가 넓다; 폭넓다, 다양하다",
    //                 "(비유적으로) 선택지·범위 등이 많다"
    //               ],
    //               "pos": "iAdjective",
    //               "examples": [
    //                 "この公園はとても広い。",
    //                 "選択肢が広いので、いろいろ試せます。"
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "食べる",
    //           "results": [
    //             {
    //               "notation": "食べる",
    //               "pronunciation": "たべる",
    //               "meanings": ["먹다; 음식물을 입으로 섭취하다"],
    //               "pos": "ichidanVerb",
    //               "examples": ["ご飯を食べる", "朝ごはんを食べました"]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "上手",
    //           "results": [
    //             {
    //               "notation": "上手",
    //               "pronunciation": "じょうず",
    //               "meanings": ["능숙한, 잘하는; 어떤 일을 잘 수행하는"],
    //               "pos": "naAdjective",
    //               "examples": ["日本語が上手です", "料理が上手だ"]
    //             },
    //             {
    //               "notation": "上手",
    //               "pronunciation": "じょうず",
    //               "meanings": ["고수, 능숙한 사람; 어떤 분야에 뛰어난 사람"],
    //               "pos": "noun",
    //               "examples": ["彼はピアノの上手だ"]
    //             }
    //           ]
    //         },
    //         {
    //           "keyword": "切る",
    //           "results": [
    //             {
    //               "notation": "切る",
    //               "pronunciation": "きる",
    //               "meanings": ["자르다; 칼이나 가위 등으로 나누다"],
    //               "pos": "godanVerb",
    //               "examples": ["紙を切る", "野菜を切る"]
    //             },
    //             {
    //               "notation": "切る",
    //               "pronunciation": "きる",
    //               "meanings": ["끊다, 끝내다; 연결이나 작동을 중단하다"],
    //               "pos": "godanVerb",
    //               "examples": ["電話を切る", "電源を切る"]
    //             }
    //           ]
    //         }
    //       ]
    //     }

    //     Detailed Rules:
    //     1. notation: Write in standard form
    //        - Kanji for Chinese-origin words (食べる, 広い, 切る)
    //        - Hiragana for native words (ひらがな)
    //        - Katakana for loanwords (カフェ, コーヒー)

    //     2. pronunciation: Always in hiragana (たべる, ひろい, きる)

    //     3. meanings: Provide 1-3 meanings in the source language with brief helpful context
    //        - Add concise explanations after semicolons (keep it simple and practical)
    //        - Examples: "기쁘다; 좋은 일이 생겨 마음이 즐거운 상태", "넓다; 공간이나 면적이 큰", "달리다; 빠르게 뛰다"
    //        - For nuanced words: "つまらない; 재미없거나 시시한", "切る; 도구로 나누다 / 연결을 끊다"
    //        - If same POS has COMPLETELY different meanings (like 切る: cut vs. disconnect), separate into different result entries
    //        - If meanings are similar/related variations, keep in one entry as an array

    //     4. pos: Choose from: godanVerb, ichidanVerb, irregularVerb, noun, naAdjective, iAdjective, adverb, preposition, conjunction, interjection

    //     5. examples: 1-2 natural, commonly used sentences that clearly demonstrate the meaning

    //     6. If a word has multiple parts of speech, create separate result entries for each POS with appropriate explanations

    //     IMPORTANT: Add brief, helpful context to meanings (not overly detailed), just enough to clarify the nuance or usage situation.

    //     Process ALL words in the input array and return results for each in the entries array.`,
    //   },
  },
);
