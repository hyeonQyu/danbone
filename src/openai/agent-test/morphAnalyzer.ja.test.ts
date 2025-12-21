import { MorphologicalAnalysisResultSchema } from '@/openai/schemes';
import z from 'zod';
import { TestCase } from './agent.test.types';

type MorphAnalysisOutput = z.infer<typeof MorphologicalAnalysisResultSchema>;

export const morphAnalyzerJaTestCases: TestCase<MorphAnalysisOutput>[] = [
  // ===== 오단동사 기본형 =====
  {
    input: '書く',
    expectedOutput: {
      tokens: [{ surface: '書く', base: '書く' }],
    },
    description: '오단동사 기본형: 書く (쓰다)',
  },
  {
    input: '待つ',
    expectedOutput: {
      tokens: [{ surface: '待つ', base: '待つ' }],
    },
    description: '오단동사 기본형: 待つ (기다리다)',
  },

  // ===== 일단동사 기본형 =====
  {
    input: '食べる',
    expectedOutput: {
      tokens: [{ surface: '食べる', base: '食べる' }],
    },
    description: '일단동사 기본형: 食べる (먹다)',
  },
  {
    input: '見る',
    expectedOutput: {
      tokens: [{ surface: '見る', base: '見る' }],
    },
    description: '일단동사 기본형: 見る (보다)',
  },

  // ===== 불규칙동사 =====
  {
    input: '来る',
    expectedOutput: {
      tokens: [{ surface: '来る', base: '来る' }],
    },
    description: '불규칙동사: 来る (오다)',
  },
  {
    input: 'する',
    expectedOutput: {
      tokens: [{ surface: 'する', base: 'する' }],
    },
    description: '불규칙동사: する (하다)',
  },

  // ===== 동사 정중형 =====
  {
    input: '歩きます',
    expectedOutput: {
      tokens: [{ surface: '歩きます', base: '歩く' }],
    },
    description: '동사 정중형: 歩きます (걷습니다)',
  },
  {
    input: '泳ぎます',
    expectedOutput: {
      tokens: [{ surface: '泳ぎます', base: '泳ぐ' }],
    },
    description: '동사 정중형: 泳ぎます (수영합니다)',
  },
  {
    input: '走ります',
    expectedOutput: {
      tokens: [{ surface: '走ります', base: '走る' }],
    },
    description: '동사 정중형: 走ります (달립니다)',
  },

  // ===== 동사 과거형 =====
  {
    input: '買った',
    expectedOutput: {
      tokens: [{ surface: '買った', base: '買う' }],
    },
    description: '동사 과거형: 買った (샀다)',
  },
  {
    input: '売った',
    expectedOutput: {
      tokens: [{ surface: '売った', base: '売る' }],
    },
    description: '동사 과거형: 売った (팔았다)',
  },
  {
    input: '開いた',
    expectedOutput: {
      tokens: [{ surface: '開いた', base: '開く' }],
    },
    description: '동사 과거형: 開いた (열었다)',
  },

  // ===== 동사 과거 정중형 =====
  {
    input: '閉めました',
    expectedOutput: {
      tokens: [{ surface: '閉めました', base: '閉める' }],
    },
    description: '동사 과거 정중형: 閉めました (닫았습니다)',
  },
  {
    input: '始めました',
    expectedOutput: {
      tokens: [{ surface: '始めました', base: '始める' }],
    },
    description: '동사 과거 정중형: 始めました (시작했습니다)',
  },

  // ===== 의문문 반말 =====
  {
    input: '帰るの?',
    expectedOutput: {
      tokens: [
        { surface: '帰る', base: '帰る' },
        { surface: 'の', base: 'の' },
      ],
    },
    description: '의문문 반말: 帰るの? (돌아가니?)',
  },
  {
    input: '終わる?',
    expectedOutput: {
      tokens: [{ surface: '終わる', base: '終わる' }],
    },
    description: '의문문 반말: 終わる? (끝나?)',
  },

  // ===== 의문문 존댓말 =====
  {
    input: '分かりますか?',
    expectedOutput: {
      tokens: [
        { surface: '分かります', base: '分かる' },
        { surface: 'か', base: 'か' },
      ],
    },
    description: '의문문 존댓말: 分かりますか? (아십니까?)',
  },
  {
    input: '知っていますか?',
    expectedOutput: {
      tokens: [
        { surface: '知っています', base: '知る' },
        { surface: 'か', base: 'か' },
      ],
    },
    description: '의문문 존댓말: 知っていますか? (알고 계십니까?)',
  },

  // ===== 명령형 =====
  {
    input: '止まれ',
    expectedOutput: {
      tokens: [{ surface: '止まれ', base: '止まる' }],
    },
    description: '명령형: 止まれ (멈춰라)',
  },
  {
    input: '黙れ',
    expectedOutput: {
      tokens: [{ surface: '黙れ', base: '黙る' }],
    },
    description: '명령형: 黙れ (닥쳐라)',
  },
  {
    input: '出ろ',
    expectedOutput: {
      tokens: [{ surface: '出ろ', base: '出る' }],
    },
    description: '명령형: 出ろ (나가라)',
  },

  // ===== 권유형 =====
  {
    input: '遊ぼう',
    expectedOutput: {
      tokens: [{ surface: '遊ぼう', base: '遊ぶ' }],
    },
    description: '권유형: 遊ぼう (놀자)',
  },
  {
    input: '休もう',
    expectedOutput: {
      tokens: [{ surface: '休もう', base: '休む' }],
    },
    description: '권유형: 休もう (쉬자)',
  },

  // ===== 권유 정중형 =====
  {
    input: '勉強しましょう',
    expectedOutput: {
      tokens: [{ surface: '勉強しましょう', base: '勉強する' }],
    },
    description: '권유 정중형: 勉強しましょう (공부합시다)',
  },
  {
    input: '働きましょう',
    expectedOutput: {
      tokens: [{ surface: '働きましょう', base: '働く' }],
    },
    description: '권유 정중형: 働きましょう (일합시다)',
  },

  // ===== 명사 =====
  {
    input: '猫',
    expectedOutput: {
      tokens: [{ surface: '猫', base: '猫' }],
    },
    description: '명사: 猫 (고양이)',
  },
  {
    input: '犬',
    expectedOutput: {
      tokens: [{ surface: '犬', base: '犬' }],
    },
    description: '명사: 犬 (개)',
  },
  {
    input: '車',
    expectedOutput: {
      tokens: [{ surface: '車', base: '車' }],
    },
    description: '명사: 車 (차)',
  },
  {
    input: '家',
    expectedOutput: {
      tokens: [{ surface: '家', base: '家' }],
    },
    description: '명사: 家 (집)',
  },
  {
    input: '駅',
    expectedOutput: {
      tokens: [{ surface: '駅', base: '駅' }],
    },
    description: '명사: 駅 (역)',
  },
  {
    input: '会社',
    expectedOutput: {
      tokens: [{ surface: '会社', base: '会社' }],
    },
    description: '명사: 会社 (회사)',
  },
  {
    input: '時計',
    expectedOutput: {
      tokens: [{ surface: '時計', base: '時計' }],
    },
    description: '명사: 時計 (시계)',
  },
  {
    input: '電話',
    expectedOutput: {
      tokens: [{ surface: '電話', base: '電話' }],
    },
    description: '명사: 電話 (전화)',
  },

  // ===== い형용사 =====
  {
    input: '新しい',
    expectedOutput: {
      tokens: [{ surface: '新しい', base: '新しい' }],
    },
    description: 'い형용사: 新しい (새로운)',
  },
  {
    input: '古い',
    expectedOutput: {
      tokens: [{ surface: '古い', base: '古い' }],
    },
    description: 'い형용사: 古い (오래된)',
  },
  {
    input: '高い',
    expectedOutput: {
      tokens: [{ surface: '高い', base: '高い' }],
    },
    description: 'い형용사: 高い (높은/비싼)',
  },
  {
    input: '安い',
    expectedOutput: {
      tokens: [{ surface: '安い', base: '安い' }],
    },
    description: 'い형용사: 安い (싼)',
  },
  {
    input: '長い',
    expectedOutput: {
      tokens: [{ surface: '長い', base: '長い' }],
    },
    description: 'い형용사: 長い (긴)',
  },
  {
    input: '短い',
    expectedOutput: {
      tokens: [{ surface: '短い', base: '短い' }],
    },
    description: 'い형용사: 短い (짧은)',
  },

  // ===== な형용사 =====
  {
    input: '綺麗',
    expectedOutput: {
      tokens: [{ surface: '綺麗', base: '綺麗' }],
    },
    description: 'な형용사: 綺麗 (예쁜)',
  },
  {
    input: '丁寧',
    expectedOutput: {
      tokens: [{ surface: '丁寧', base: '丁寧' }],
    },
    description: 'な형용사: 丁寧 (정중한)',
  },
  {
    input: '元気',
    expectedOutput: {
      tokens: [{ surface: '元気', base: '元気' }],
    },
    description: 'な형용사: 元気 (건강한)',
  },
  {
    input: '暇',
    expectedOutput: {
      tokens: [{ surface: '暇', base: '暇' }],
    },
    description: 'な형용사: 暇 (한가한)',
  },
  {
    input: '有名',
    expectedOutput: {
      tokens: [{ surface: '有名', base: '有名' }],
    },
    description: 'な형용사: 有名 (유명한)',
  },

  // ===== 부사 =====
  {
    input: 'すぐ',
    expectedOutput: {
      tokens: [{ surface: 'すぐ', base: 'すぐ' }],
    },
    description: '부사: すぐ (곧)',
  },
  {
    input: 'もっと',
    expectedOutput: {
      tokens: [{ surface: 'もっと', base: 'もっと' }],
    },
    description: '부사: もっと (더)',
  },
  {
    input: 'たくさん',
    expectedOutput: {
      tokens: [{ surface: 'たくさん', base: 'たくさん' }],
    },
    description: '부사: たくさん (많이)',
  },
  {
    input: '少し',
    expectedOutput: {
      tokens: [{ surface: '少し', base: '少し' }],
    },
    description: '부사: 少し (조금)',
  },

  // ===== 문장: 반말 =====
  {
    input: '明日公園で遊ぶ',
    expectedOutput: {
      tokens: [
        { surface: '明日', base: '明日' },
        { surface: '公園', base: '公園' },
        { surface: 'で', base: 'で' },
        { surface: '遊ぶ', base: '遊ぶ' },
      ],
    },
    description: '문장 반말: 明日公園で遊ぶ (내일 공원에서 놀다)',
  },
  {
    input: '昨日本を読んだ',
    expectedOutput: {
      tokens: [
        { surface: '昨日', base: '昨日' },
        { surface: '本', base: '本' },
        { surface: 'を', base: 'を' },
        { surface: '読んだ', base: '読む' },
      ],
    },
    description: '문장 반말: 昨日本を読んだ (어제 책을 읽었다)',
  },

  // ===== 문장: 존댓말 =====
  {
    input: '毎日会社に行きます',
    expectedOutput: {
      tokens: [
        { surface: '毎日', base: '毎日' },
        { surface: '会社', base: '会社' },
        { surface: 'に', base: 'に' },
        { surface: '行きます', base: '行く' },
      ],
    },
    description: '문장 존댓말: 毎日会社に行きます (매일 회사에 갑니다)',
  },
  {
    input: '週末に映画を見ます',
    expectedOutput: {
      tokens: [
        { surface: '週末', base: '週末' },
        { surface: 'に', base: 'に' },
        { surface: '映画', base: '映画' },
        { surface: 'を', base: 'を' },
        { surface: '見ます', base: '見る' },
      ],
    },
    description: '문장 존댓말: 週末に映画を見ます (주말에 영화를 봅니다)',
  },

  // ===== 문장: 의문문 반말 =====
  {
    input: 'これは誰の鞄?',
    expectedOutput: {
      tokens: [
        { surface: 'これ', base: 'これ' },
        { surface: 'は', base: 'は' },
        { surface: '誰', base: '誰' },
        { surface: 'の', base: 'の' },
        { surface: '鞄', base: '鞄' },
      ],
    },
    description: '문장 의문문 반말: これは誰の鞄? (이건 누구 가방?)',
  },
  {
    input: 'どこに住んでる?',
    expectedOutput: {
      tokens: [
        { surface: 'どこ', base: 'どこ' },
        { surface: 'に', base: 'に' },
        { surface: '住んでる', base: '住む' },
      ],
    },
    description: '문장 의문문 반말: どこに住んでる? (어디 살아?)',
  },

  // ===== 문장: 의문문 존댓말 =====
  {
    input: 'お名前は何ですか?',
    expectedOutput: {
      tokens: [
        { surface: 'お名前', base: 'お名前' },
        { surface: 'は', base: 'は' },
        { surface: '何', base: '何' },
        { surface: 'です', base: 'だ' },
        { surface: 'か', base: 'か' },
      ],
    },
    description: '문장 의문문 존댓말: お名前は何ですか? (성함이 어떻게 되십니까?)',
  },
  {
    input: 'どちらから来ましたか?',
    expectedOutput: {
      tokens: [
        { surface: 'どちら', base: 'どちら' },
        { surface: 'から', base: 'から' },
        { surface: '来ました', base: '来る' },
        { surface: 'か', base: 'か' },
      ],
    },
    description: '문장 의문문 존댓말: どちらから来ましたか? (어디서 오셨습니까?)',
  },

  // ===== 문장: 명령문 =====
  {
    input: '早く起きろ',
    expectedOutput: {
      tokens: [
        { surface: '早く', base: '早い' },
        { surface: '起きろ', base: '起きる' },
      ],
    },
    description: '문장 명령문: 早く起きろ (빨리 일어나라)',
  },
  {
    input: 'ここで待て',
    expectedOutput: {
      tokens: [
        { surface: 'ここ', base: 'ここ' },
        { surface: 'で', base: 'で' },
        { surface: '待て', base: '待���' },
      ],
    },
    description: '문장 명령문: ここで待て (여기서 기다려)',
  },

  // ===== 문장: 권유문 반말 =====
  {
    input: '一緒に帰ろう',
    expectedOutput: {
      tokens: [
        { surface: '一緒', base: '一緒' },
        { surface: 'に', base: 'に' },
        { surface: '帰ろう', base: '帰る' },
      ],
    },
    description: '문장 권유문 반말: 一緒に帰ろう (같이 돌아가자)',
  },
  {
    input: 'カフェに行こう',
    expectedOutput: {
      tokens: [
        { surface: 'カフェ', base: 'カフェ' },
        { surface: 'に', base: 'に' },
        { surface: '行こう', base: '行く' },
      ],
    },
    description: '문장 권유문 반말: カフェに行こう (카페에 가자)',
  },

  // ===== 문장: 권유문 존댓말 =====
  {
    input: 'ゆっくり話しましょう',
    expectedOutput: {
      tokens: [
        { surface: 'ゆっくり', base: 'ゆっくり' },
        { surface: '話しましょう', base: '話す' },
      ],
    },
    description: '문장 권유문 존댓말: ゆっくり話しましょう (천천히 말합시다)',
  },
  {
    input: '写真を撮りましょう',
    expectedOutput: {
      tokens: [
        { surface: '写真', base: '写真' },
        { surface: 'を', base: 'を' },
        { surface: '撮りましょう', base: '撮る' },
      ],
    },
    description: '문장 권유문 존댓말: 写真を撮りましょう (사진을 찍읍시다)',
  },

  // ===== 문장: 부정문 반말 =====
  {
    input: '分からない',
    expectedOutput: {
      tokens: [{ surface: '分からない', base: '分かる' }],
    },
    description: '문장 부정문 반말: 分からない (모르겠어)',
  },
  {
    input: '知らない',
    expectedOutput: {
      tokens: [{ surface: '知らない', base: '知る' }],
    },
    description: '문장 부정문 반말: 知らない (몰라)',
  },

  // ===== 문장: 부정문 존댓말 =====
  {
    input: '食べません',
    expectedOutput: {
      tokens: [{ surface: '食べません', base: '食べる' }],
    },
    description: '문장 부정문 존댓말: 食べません (먹지 않습니다)',
  },
  {
    input: '飲みません',
    expectedOutput: {
      tokens: [{ surface: '飲みません', base: '飲む' }],
    },
    description: '문장 부정문 존댓말: 飲みません (마시지 않습니다)',
  },

  // ===== 문장: 과거 =====
  {
    input: '先週友達に会った',
    expectedOutput: {
      tokens: [
        { surface: '先週', base: '先週' },
        { surface: '友達', base: '友達' },
        { surface: 'に', base: 'に' },
        { surface: '会った', base: '会う' },
      ],
    },
    description: '문장 과거: 先週友達に会った (지난주 친구를 만났다)',
  },
  {
    input: '去年日本に行きました',
    expectedOutput: {
      tokens: [
        { surface: '去年', base: '去年' },
        { surface: '日本', base: '日本' },
        { surface: 'に', base: 'に' },
        { surface: '行きました', base: '行く' },
      ],
    },
    description: '문장 과거: 去年日本に行きました (작년에 일본에 갔습니다)',
  },

  // ===== 문장: 복합문장 =====
  {
    input: '朝ごはんを食べて学校に行く',
    expectedOutput: {
      tokens: [
        { surface: '朝ごはん', base: '朝ごはん' },
        { surface: 'を', base: 'を' },
        { surface: '食べて', base: '食べる' },
        { surface: '学校', base: '学校' },
        { surface: 'に', base: 'に' },
        { surface: '行く', base: '行く' },
      ],
    },
    description: '문장 복합: 朝ごはんを食べて学校に行く (아침 먹고 학교에 간다)',
  },
  {
    input: '駅で降りて歩いた',
    expectedOutput: {
      tokens: [
        { surface: '駅', base: '駅' },
        { surface: 'で', base: 'で' },
        { surface: '降りて', base: '降りる' },
        { surface: '歩いた', base: '歩く' },
      ],
    },
    description: '문장 복합: 駅で降りて歩いた (역에서 내려서 걸었다)',
  },
];
