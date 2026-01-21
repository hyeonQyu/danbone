import { TextModel } from './model.types';

interface Price {
  input: number;
  cachedInput: number;
  output: number;
}

export const TEXT_TOKEN_UNIT = 1_000_000;

export const TEXT_STANDARD_USD_PRICE = {
  'gpt-5.1': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5-mini': { input: 0.25, cachedInput: 0.025, output: 2.0 },
  'gpt-5-nano': { input: 0.05, cachedInput: 0.005, output: 0.4 },
  'gpt-5.1-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5-chat-latest': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5.1-codex-max': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5.1-codex': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5-codex': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-5-pro': { input: 15.0, cachedInput: 0, output: 120.0 },
  'gpt-4.1': { input: 2.0, cachedInput: 0.5, output: 8.0 },
  'gpt-4.1-mini': { input: 0.4, cachedInput: 0.1, output: 1.6 },
  'gpt-4.1-nano': { input: 0.1, cachedInput: 0.025, output: 0.4 },
  'gpt-4o': { input: 2.5, cachedInput: 1.25, output: 10.0 },
  'gpt-4o-2024-05-13': { input: 5.0, cachedInput: 0, output: 15.0 },
  'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
  'gpt-realtime': { input: 4.0, cachedInput: 0.4, output: 16.0 },
  'gpt-realtime-mini': { input: 0.6, cachedInput: 0.06, output: 2.4 },
  'gpt-4o-realtime-preview': { input: 5.0, cachedInput: 2.5, output: 20.0 },
  'gpt-4o-mini-realtime-preview': { input: 0.6, cachedInput: 0.3, output: 2.4 },
  'gpt-audio': { input: 2.5, cachedInput: 0, output: 10.0 },
  'gpt-audio-mini': { input: 0.6, cachedInput: 0, output: 2.4 },
  'gpt-4o-audio-preview': { input: 2.5, cachedInput: 0, output: 10.0 },
  'gpt-4o-mini-audio-preview': { input: 0.15, cachedInput: 0, output: 0.6 },
  o1: { input: 15.0, cachedInput: 7.5, output: 60.0 },
  'o1-pro': { input: 150.0, cachedInput: 0, output: 600.0 },
  'o3-pro': { input: 20.0, cachedInput: 0, output: 80.0 },
  o3: { input: 2.0, cachedInput: 0.5, output: 8.0 },
  'o3-deep-research': { input: 10.0, cachedInput: 2.5, output: 40.0 },
  'o4-mini': { input: 1.1, cachedInput: 0.275, output: 4.4 },
  'o4-mini-deep-research': { input: 2.0, cachedInput: 0.5, output: 8.0 },
  'o3-mini': { input: 1.1, cachedInput: 0.55, output: 4.4 },
  'o1-mini': { input: 1.1, cachedInput: 0.55, output: 4.4 },
  'gpt-5.1-codex-mini': { input: 0.25, cachedInput: 0.025, output: 2.0 },
  'codex-mini-latest': { input: 1.5, cachedInput: 0.375, output: 6.0 },
  'gpt-5-search-api': { input: 1.25, cachedInput: 0.125, output: 10.0 },
  'gpt-4o-mini-search-preview': { input: 0.15, cachedInput: 0, output: 0.6 },
  'gpt-4o-search-preview': { input: 2.5, cachedInput: 0, output: 10.0 },
  'computer-use-preview': { input: 3.0, cachedInput: 0, output: 12.0 },
  'gpt-image-1': { input: 5.0, cachedInput: 1.25, output: 0 },
  'gpt-image-1-mini': { input: 2.0, cachedInput: 0.2, output: 0 },
} as const satisfies Record<TextModel, Price>;

export const TEXT_BATCH_USD_PRICE = {
  'gpt-5.1': { input: 0.625, cachedInput: 0.0625, output: 5.0 },
  'gpt-5': { input: 0.625, cachedInput: 0.0625, output: 5.0 },
  'gpt-5-mini': { input: 0.125, cachedInput: 0.0125, output: 1.0 },
  'gpt-5-nano': { input: 0.025, cachedInput: 0.0025, output: 0.2 },
  'gpt-5-pro': { input: 7.5, cachedInput: 0, output: 60.0 },
  'gpt-4.1': { input: 1.0, cachedInput: 0, output: 4.0 },
  'gpt-4.1-mini': { input: 0.2, cachedInput: 0, output: 0.8 },
  'gpt-4.1-nano': { input: 0.05, cachedInput: 0, output: 0.2 },
  'gpt-4o': { input: 1.25, cachedInput: 0, output: 5.0 },
  'gpt-4o-2024-05-13': { input: 2.5, cachedInput: 0, output: 7.5 },
  'gpt-4o-mini': { input: 0.075, cachedInput: 0, output: 0.3 },
  o1: { input: 7.5, cachedInput: 0, output: 30.0 },
  'o1-pro': { input: 75.0, cachedInput: 0, output: 300.0 },
  'o3-pro': { input: 10.0, cachedInput: 0, output: 40.0 },
  o3: { input: 1.0, cachedInput: 0, output: 4.0 },
  'o3-deep-research': { input: 5.0, cachedInput: 0, output: 20.0 },
  'o4-mini': { input: 0.55, cachedInput: 0, output: 2.2 },
  'o4-mini-deep-research': { input: 1.0, cachedInput: 0, output: 4.0 },
  'o3-mini': { input: 0.55, cachedInput: 0, output: 2.2 },
  'o1-mini': { input: 0.55, cachedInput: 0, output: 2.2 },
  'computer-use-preview': { input: 1.5, cachedInput: 0, output: 6.0 },
} as const satisfies Partial<Record<TextModel, Price>>;
