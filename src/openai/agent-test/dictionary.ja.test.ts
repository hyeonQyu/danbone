import { DictionaryOutputSchemaByLanguage } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type DictionaryOutput = z.infer<typeof DictionaryOutputSchemaByLanguage.ja>;

export const dictionaryJaTestCases: TestCase<DictionaryOutput, Record<string, unknown>>[] = [
  // ===== 1. 단일 품사, 단일 의미 (3개) =====
  {
    input: { sourceLanguage: 'ko', words: ['鳥'] },
    expectedOutput: {
      words: [
        {
          keyword: '鳥',
          entries: [
            {
              notation: '鳥',
              pronunciation: 'とり',
              meanings: ['새'],
              pos: 'noun',
              examples: ['鳥が飛ぶ', '鳥の声'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 단일 의미: 鳥 (명사, 새)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['笑う'] },
    expectedOutput: {
      words: [
        {
          keyword: '笑う',
          entries: [
            {
              notation: '笑う',
              pronunciation: 'わらう',
              meanings: ['웃다'],
              pos: 'godanVerb',
              examples: ['大きく笑う', '彼女は笑っています'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 단일 의미: 笑う (오단동사, 웃다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['静か'] },
    expectedOutput: {
      words: [
        {
          keyword: '静か',
          entries: [
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
      words: [
        {
          keyword: 'つまらない',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['美しい'] },
    expectedOutput: {
      words: [
        {
          keyword: '美しい',
          entries: [
            {
              notation: '美しい',
              pronunciation: 'うつくしい',
              meanings: ['아름답다', '예쁘다'],
              pos: 'iAdjective',
              examples: ['美しい景色', '美しい花'],
            },
          ],
        },
      ],
    },
    description: '단일 품사, 복수 유사 의미: 美しい (い형용사, 아름답다/예쁘다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['広い'] },
    expectedOutput: {
      words: [
        {
          keyword: '広い',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['開く'] },
    expectedOutput: {
      words: [
        {
          keyword: '開く',
          entries: [
            {
              notation: '開く',
              pronunciation: 'ひらく',
              meanings: ['열리다', '펼치다'],
              pos: 'godanVerb',
              examples: ['本を開く', '花が開く'],
            },
            {
              notation: '開く',
              pronunciation: 'ひらく',
              meanings: ['개최하다', '시작하다'],
              pos: 'godanVerb',
              examples: ['会議を開く', 'パーティーを開く'],
            },
          ],
        },
      ],
    },
    description: '동일 품사, 완전히 다른 의미: 開く (오단동사, 열리다 / 개최하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['打つ'] },
    expectedOutput: {
      words: [
        {
          keyword: '打つ',
          entries: [
            {
              notation: '打つ',
              pronunciation: 'うつ',
              meanings: ['치다', '때리다'],
              pos: 'godanVerb',
              examples: ['ボールを打つ', '太鼓を打つ'],
            },
            {
              notation: '打つ',
              pronunciation: 'うつ',
              meanings: ['(문자를) 입력하다', '타이핑하다'],
              pos: 'godanVerb',
              examples: ['メールを打つ', 'キーボードを打つ'],
            },
          ],
        },
      ],
    },
    description: '동일 품사, 완전히 다른 의미: 打つ (오단동사, 치다 / 타이핑하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['取る'] },
    expectedOutput: {
      words: [
        {
          keyword: '取る',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['安全'] },
    expectedOutput: {
      words: [
        {
          keyword: '安全',
          entries: [
            {
              notation: '安全',
              pronunciation: 'あんぜん',
              meanings: ['안전한'],
              pos: 'naAdjective',
              examples: ['安全な場所', '安全に運転する'],
            },
            {
              notation: '安全',
              pronunciation: 'あんぜん',
              meanings: ['안전'],
              pos: 'noun',
              examples: ['安全を確認する', '安全が第一だ'],
            },
          ],
        },
      ],
    },
    description: '복수 품사, 각기 다른 의미: 安全 (な형용사=안전한 / 명사=안전)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['元気'] },
    expectedOutput: {
      words: [
        {
          keyword: '元気',
          entries: [
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
      words: [
        {
          keyword: '大切',
          entries: [
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
      words: [
        {
          keyword: 'かける',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['はかる'] },
    expectedOutput: {
      words: [
        {
          keyword: 'はかる',
          entries: [
            {
              notation: '測る',
              pronunciation: 'はかる',
              meanings: ['재다', '측정하다'],
              pos: 'godanVerb',
              examples: ['長さを測る', '体重を測る'],
            },
            {
              notation: '図る',
              pronunciation: 'はかる',
              meanings: ['꾀하다', '도모하다'],
              pos: 'godanVerb',
              examples: ['成功を図る', '解決を図る'],
            },
          ],
        },
      ],
    },
    description: '복잡한 케이스: はかる (측정하다 / 도모하다)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['あける'] },
    expectedOutput: {
      words: [
        {
          keyword: 'あける',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['レストラン'] },
    expectedOutput: {
      words: [
        {
          keyword: 'レストラン',
          entries: [
            {
              notation: 'レストラン',
              pronunciation: 'れすとらん',
              meanings: ['레스토랑', '식당'],
              pos: 'noun',
              examples: ['レストランで食事する', 'イタリアンレストラン'],
            },
          ],
        },
      ],
    },
    description: '외래어: レストラン (명사, 레스토랑)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['ホテル'] },
    expectedOutput: {
      words: [
        {
          keyword: 'ホテル',
          entries: [
            {
              notation: 'ホテル',
              pronunciation: 'ほてる',
              meanings: ['호텔'],
              pos: 'noun',
              examples: ['ホテルに泊まる', 'ホテルを予約する'],
            },
          ],
        },
      ],
    },
    description: '외래어: ホテル (명사, 호텔)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['パソコン'] },
    expectedOutput: {
      words: [
        {
          keyword: 'パソコン',
          entries: [
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
      words: [
        {
          keyword: 'する',
          entries: [
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
      words: [
        {
          keyword: '来る',
          entries: [
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
      words: [
        {
          keyword: '勉強する',
          entries: [
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
    input: { sourceLanguage: 'ko', words: ['鳥', '犬'] },
    expectedOutput: {
      words: [
        {
          keyword: '鳥',
          entries: [
            {
              notation: '鳥',
              pronunciation: 'とり',
              meanings: ['새'],
              pos: 'noun',
              examples: ['鳥が飛ぶ', '鳥の声'],
            },
          ],
        },
        {
          keyword: '犬',
          entries: [
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
    description: '여러 단어 동시 입력: 鳥, 犬 (2개 명사)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['読む', '聞く', '寝る'] },
    expectedOutput: {
      words: [
        {
          keyword: '読む',
          entries: [
            {
              notation: '読む',
              pronunciation: 'よむ',
              meanings: ['읽다'],
              pos: 'godanVerb',
              examples: ['本を読む', '新聞を読む'],
            },
          ],
        },
        {
          keyword: '聞く',
          entries: [
            {
              notation: '聞く',
              pronunciation: 'きく',
              meanings: ['듣다', '묻다'],
              pos: 'godanVerb',
              examples: ['音楽を聞く', '質問を聞く'],
            },
          ],
        },
        {
          keyword: '寝る',
          entries: [
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
    description: '여러 단어 동시 입력: 読む, 聞く, 寝る (3개 동사)',
  },
  {
    input: { sourceLanguage: 'ko', words: ['安全', '元気'] },
    expectedOutput: {
      words: [
        {
          keyword: '安全',
          entries: [
            {
              notation: '安全',
              pronunciation: 'あんぜん',
              meanings: ['안전한'],
              pos: 'naAdjective',
              examples: ['安全な場所', '安全に運転する'],
            },
            {
              notation: '安全',
              pronunciation: 'あんぜん',
              meanings: ['안전'],
              pos: 'noun',
              examples: ['安全を確認する', '安全が第一だ'],
            },
          ],
        },
        {
          keyword: '元気',
          entries: [
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
    description: '여러 단어 동시 입력: 安全, 元気 (복수 품사 단어 2개)',
  },
];
