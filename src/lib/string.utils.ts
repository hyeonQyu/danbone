export const REGEXP = {
  kanji: /[\u4E00-\u9FFF]/,
  hiragana: /[\u3040-\u309F]/,
  katakana: /[\u30A0-\u30FF]/,
  alphabet: /[A-Za-z]/,
  number: /[0-9]/,
  email: /^[A-Za-z0-9_.\-]{1,64}@[A-Za-z0-9_.\-]{1,260}$/,
} as const;

export const hasPattern = (str: string, pattern: RegExp) => pattern.test(str);

export const isPattern = (str: string, pattern: RegExp) => {
  const anchoredPattern = new RegExp(`^${pattern.source}+$`, pattern.flags);
  return anchoredPattern.test(str);
};

export const isNumber = (str: string) => isPattern(str, REGEXP.number);

export const isEmail = (str: string) => REGEXP.email.test(str);

export const hasKanji = (str: string) => hasPattern(str, REGEXP.kanji);

export const isHiragana = (str: string) => isPattern(str, REGEXP.hiragana);

export const isKatakana = (str: string) => isPattern(str, REGEXP.katakana);

export const hasAlphabet = (str: string) => hasPattern(str, REGEXP.alphabet);
