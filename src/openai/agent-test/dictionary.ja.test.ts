import { DictionaryOutputSchemaByLanguage } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type DictionaryOutput = z.infer<typeof DictionaryOutputSchemaByLanguage.ja>;

export const dictionaryJaTestCases: TestCase<DictionaryOutput, Record<string, unknown>>[] = [
  // ===== 1. 단일 품사, 단일 의미 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['猫'] },
    expectedOutput: {
      entries: [
        {
          keyword: '猫',
          results: [
            {
              notation: '猫',
              pronunciation: 'ねこ',
              meanings: ['고양이'],
              pos: 'noun',
              examples: ['猫を飼う', '猫が好きです'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 단일 의미: 猫 (명사, 고양이)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['走る'] },
    expectedOutput: {
      entries: [
        {
          keyword: '走る',
          results: [
            {
              notation: '走る',
              pronunciation: 'はしる',
              meanings: ['달리다'],
              pos: 'godanVerb',
              examples: ['速く走る', '毎朝走ります'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 단일 의미: 走る (오단동사, 달리다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['静か'] },
    expectedOutput: {
      entries: [
        {
          keyword: '静か',
          results: [
            {
              notation: '静か',
              pronunciation: 'しずか',
              meanings: ['조용하다', '고요하다'],
              pos: 'naAdjective',
              examples: ['静かな場所', 'ここは静かです'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 단일 의미: 静か (な형용사, 조용하다)',
  },

  // ===== 2. 단일 품사, 복수 유사 의미 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['つまらない'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'つまらない',
          results: [
            {
              notation: 'つまらない',
              pronunciation: 'つまらない',
              meanings: ['지루하다', '재미없다', '따분하다'],
              pos: 'iAdjective',
              examples: ['つまらない映画', 'この本はつまらない'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 복수 유사 의미: つまらない (い형용사, 지루하다/재미없다/따분하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['嬉しい'] },
    expectedOutput: {
      entries: [
        {
          keyword: '嬉しい',
          results: [
            {
              notation: '嬉しい',
              pronunciation: 'うれしい',
              meanings: ['기쁘다', '즐겁다'],
              pos: 'iAdjective',
              examples: ['嬉しいニュース', 'とても嬉しいです'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 복수 유사 의미: 嬉しい (い형용사, 기쁘다/즐겁다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['広い'] },
    expectedOutput: {
      entries: [
        {
          keyword: '広い',
          results: [
            {
              notation: '広い',
              pronunciation: 'ひろい',
              meanings: ['넓다', '광대하다'],
              pos: 'iAdjective',
              examples: ['広い部屋', '庭が広い'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 복수 유사 의미: 広い (い형용사, 넓다/광대하다)',
  },

  // ===== 3. 동일 품사, 완전히 다른 의미 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['立つ'] },
    expectedOutput: {
      entries: [
        {
          keyword: '立つ',
          results: [
            {
              notation: '立つ',
              pronunciation: 'たつ',
              meanings: ['서다'],
              pos: 'godanVerb',
              examples: ['そこに立つ', '立って話す'],
            },
            {
              notation: '立つ',
              pronunciation: 'たつ',
              meanings: ['출발하다', '떠나다'],
              pos: 'godanVerb',
              examples: ['電車が立つ', '駅を立つ'],
            },
          ],
        },
      ],
    },
    description: '동일 품사, 완전히 다른 의미: 立つ (오단동사, 서다 / 출발하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['切る'] },
    expectedOutput: {
      entries: [
        {
          keyword: '切る',
          results: [
            {
              notation: '切る',
              pronunciation: 'きる',
              meanings: ['자르다'],
              pos: 'godanVerb',
              examples: ['紙を切る', '野菜を切る'],
            },
            {
              notation: '切る',
              pronunciation: 'きる',
              meanings: ['끊다', '끝내다'],
              pos: 'godanVerb',
              examples: ['電話を切る', '電源を切る'],
            },
          ],
        },
      ],
    },
    description: '동일 품사, 완전히 다른 의미: 切る (오단동사, 자르다 / 끊다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['取る'] },
    expectedOutput: {
      entries: [
        {
          keyword: '取る',
          results: [
            {
              notation: '取る',
              pronunciation: 'とる',
              meanings: ['가져가다', '잡다'],
              pos: 'godanVerb',
              examples: ['手を取る', 'ペンを取る'],
            },
            {
              notation: '取る',
              pronunciation: 'とる',
              meanings: ['(나이를) 먹다'],
              pos: 'godanVerb',
              examples: ['年を取る', '歳を取った'],
            },
          ],
        },
      ],
    },
    description: '동일 품사, 완전히 다른 의미: 取る (오단동사, 가져가다 / 나이먹다)',
  },

  // ===== 4. 복수 품사, 각기 다른 의미 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['上手'] },
    expectedOutput: {
      entries: [
        {
          keyword: '上手',
          results: [
            {
              notation: '上手',
              pronunciation: 'じょうず',
              meanings: ['능숙한', '잘하는'],
              pos: 'naAdjective',
              examples: ['日本語が上手です', '料理が上手だ'],
            },
            {
              notation: '上手',
              pronunciation: 'じょうず',
              meanings: ['고수', '능숙한 사람'],
              pos: 'noun',
              examples: ['彼はピアノの上手だ'],
            },
          ],
        },
      ],
    },
    description: '복수 품사, 각기 다른 의미: 上手 (な형용사=능숙한 / 명사=고수)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['元気'] },
    expectedOutput: {
      entries: [
        {
          keyword: '元気',
          results: [
            {
              notation: '元気',
              pronunciation: 'げんき',
              meanings: ['건강한', '활기찬'],
              pos: 'naAdjective',
              examples: ['元気な子供', '元気に過ごす'],
            },
            {
              notation: '元気',
              pronunciation: 'げんき',
              meanings: ['건강', '활기'],
              pos: 'noun',
              examples: ['元気がない', '元気をもらう'],
            },
          ],
        },
      ],
    },
    description: '복수 품사, 각기 다른 의미: 元気 (な형용사=건강한 / 명사=건강)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['大切'] },
    expectedOutput: {
      entries: [
        {
          keyword: '大切',
          results: [
            {
              notation: '大切',
              pronunciation: 'たいせつ',
              meanings: ['소중한', '중요한'],
              pos: 'naAdjective',
              examples: ['大切な人', '大切にする'],
            },
            {
              notation: '大切',
              pronunciation: 'たいせつ',
              meanings: ['소중함'],
              pos: 'noun',
              examples: ['家族の大切さ'],
            },
          ],
        },
      ],
    },
    description: '복수 품사, 각기 다른 의미: 大切 (な형용사=소중한 / 명사=소중함)',
  },

  // ===== 5. 복잡한 케이스 - 의미가 완전히 다른 경우 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['かける'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'かける',
          results: [
            {
              notation: '掛ける',
              pronunciation: 'かける',
              meanings: ['걸다', '매달다'],
              pos: 'ichidanVerb',
              examples: ['壁に絵を掛ける', '電話をかける'],
            },
            {
              notation: '掛ける',
              pronunciation: 'かける',
              meanings: ['곱하다'],
              pos: 'ichidanVerb',
              examples: ['2に3を掛ける'],
            },
          ],
        },
      ],
    },
    description: '복잡한 케이스: かける (일단동사, 걸다 / 곱하다 등)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['きる'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'きる',
          results: [
            {
              notation: '着る',
              pronunciation: 'きる',
              meanings: ['입다'],
              pos: 'ichidanVerb',
              examples: ['服を着る', 'コートを着る'],
            },
            {
              notation: '切る',
              pronunciation: 'きる',
              meanings: ['자르다'],
              pos: 'godanVerb',
              examples: ['髪を切る', 'ケーキを切る'],
            },
          ],
        },
      ],
    },
    description: '복잡한 케이스: きる (착る=일단동사 입다 / 키루=오단동사 자르다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['あける'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'あける',
          results: [
            {
              notation: '開ける',
              pronunciation: 'あける',
              meanings: ['열다'],
              pos: 'ichidanVerb',
              examples: ['窓を開ける', 'ドアを開ける'],
            },
            {
              notation: '空ける',
              pronunciation: 'あける',
              meanings: ['비우다'],
              pos: 'ichidanVerb',
              examples: ['席を空ける', '時間を空ける'],
            },
          ],
        },
      ],
    },
    description: '복잡한 케이스: あける (히라쿠=열다 / 아쿠=비우다)',
  },

  // ===== 6. 외래어 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['カフェ'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'カフェ',
          results: [
            {
              notation: 'カフェ',
              pronunciation: 'かふぇ',
              meanings: ['카페'],
              pos: 'noun',
              examples: ['カフェに行く', 'カフェでコーヒーを飲む'],
            },
          ],
        },
      ],
    },
    description: '외래어: カフェ (명사, 카페)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['コーヒー'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'コーヒー',
          results: [
            {
              notation: 'コーヒー',
              pronunciation: 'こーひー',
              meanings: ['커피'],
              pos: 'noun',
              examples: ['コーヒーを飲む', 'コーヒーが好きです'],
            },
          ],
        },
      ],
    },
    description: '외래어: コーヒー (명사, 커피)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['パソコン'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'パソコン',
          results: [
            {
              notation: 'パソコン',
              pronunciation: 'ぱそこん',
              meanings: ['컴퓨터'],
              pos: 'noun',
              examples: ['パソコンを使う', 'パソコンで仕事をする'],
            },
          ],
        },
      ],
    },
    description: '외래어: パソコン (명사, 컴퓨터)',
  },

  // ===== 7. 불규칙동사 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['する'] },
    expectedOutput: {
      entries: [
        {
          keyword: 'する',
          results: [
            {
              notation: 'する',
              pronunciation: 'する',
              meanings: ['하다'],
              pos: 'irregularVerb',
              examples: ['勉強する', '仕事をする'],
            },
          ],
        },
      ],
    },
    description: '불규칙동사: する (하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['来る'] },
    expectedOutput: {
      entries: [
        {
          keyword: '来る',
          results: [
            {
              notation: '来る',
              pronunciation: 'くる',
              meanings: ['오다'],
              pos: 'irregularVerb',
              examples: ['友達が来る', '明日来ます'],
            },
          ],
        },
      ],
    },
    description: '불규칙동사: 来る (오다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['勉強する'] },
    expectedOutput: {
      entries: [
        {
          keyword: '勉強する',
          results: [
            {
              notation: '勉強する',
              pronunciation: 'べんきょうする',
              meanings: ['공부하다'],
              pos: 'irregularVerb',
              examples: ['毎日勉強する', '日本語を勉強する'],
            },
          ],
        },
      ],
    },
    description: '불규칙동사: 勉強する (공부하다)',
  },

  // ===== 8. 여러 단어 동시 입력 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['猫', '犬'] },
    expectedOutput: {
      entries: [
        {
          keyword: '猫',
          results: [
            {
              notation: '猫',
              pronunciation: 'ねこ',
              meanings: ['고양이'],
              pos: 'noun',
              examples: ['猫を飼う', '猫が好きです'],
            },
          ],
        },
        {
          keyword: '犬',
          results: [
            {
              notation: '犬',
              pronunciation: 'いぬ',
              meanings: ['개'],
              pos: 'noun',
              examples: ['犬を飼う', '犬が好きです'],
            },
          ],
        },
      ],
    },
    description: '여러 단어 동시 입력: 猫, 犬 (2개 명사)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['食べる', '飲む', '寝る'] },
    expectedOutput: {
      entries: [
        {
          keyword: '食べる',
          results: [
            {
              notation: '食べる',
              pronunciation: 'たべる',
              meanings: ['먹다'],
              pos: 'ichidanVerb',
              examples: ['ご飯を食べる', '朝ごはんを食べる'],
            },
          ],
        },
        {
          keyword: '飲む',
          results: [
            {
              notation: '飲む',
              pronunciation: 'のむ',
              meanings: ['마시다'],
              pos: 'godanVerb',
              examples: ['水を飲む', 'お茶を飲む'],
            },
          ],
        },
        {
          keyword: '寝る',
          results: [
            {
              notation: '寝る',
              pronunciation: 'ねる',
              meanings: ['자다'],
              pos: 'ichidanVerb',
              examples: ['早く寝る', '夜寝ます'],
            },
          ],
        },
      ],
    },
    description: '여러 단어 동시 입력: 食べる, 飲む, 寝る (3개 동사)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['上手', '元気'] },
    expectedOutput: {
      entries: [
        {
          keyword: '上手',
          results: [
            {
              notation: '上手',
              pronunciation: 'じょうず',
              meanings: ['능숙한', '잘하는'],
              pos: 'naAdjective',
              examples: ['日本語が上手です', '料理が上手だ'],
            },
            {
              notation: '上手',
              pronunciation: 'じょうず',
              meanings: ['고수', '능숙한 사람'],
              pos: 'noun',
              examples: ['彼はピアノの上手だ'],
            },
          ],
        },
        {
          keyword: '元気',
          results: [
            {
              notation: '元気',
              pronunciation: 'げんき',
              meanings: ['건강한', '활기찬'],
              pos: 'naAdjective',
              examples: ['元気な子供', '元気に過ごす'],
            },
            {
              notation: '元気',
              pronunciation: 'げんき',
              meanings: ['건강', '활기'],
              pos: 'noun',
              examples: ['元気がない', '元気をもらう'],
            },
          ],
        },
      ],
    },
    description: '여러 단어 동시 입력: 上手, 元気 (복수 품사 단어 2개)',
  },
];
