import { DocumentEntity } from '@/data/entity.types';
import { TextModel } from '@/openai/model.types';

export type TrackingStatus = 'idle' | 'tracking' | 'completed' | 'error';

export interface TrackingState {
  trackingId: string;
  feature: string;
  userId: string;
  status: TrackingStatus;
  startTime: number;
  metadata?: Record<string, unknown>;

  totalRegularInputTokens: number;
  totalCachedInputTokens: number;
  totalOutputTokens: number;
  totalRegularInputCost: number;
  totalCachedInputCost: number;
  totalOutputCost: number;
  totalSavedByCaching: number;
  usedModels: Set<TextModel>;
}

export interface AccumulatedUsage {
  regularInputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  totalTokens: number;
  regularInputCost: number;
  cachedInputCost: number;
  outputCost: number;
  totalCost: number;
  savedByCaching: number;
  usedModels: string[];
  duration: number;
}

export interface UsageLogEntity extends DocumentEntity {
  userId: string;
  feature: string;

  regularInputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  totalTokens: number;

  regularInputCost: number;
  cachedInputCost: number;
  outputCost: number;
  totalCost: number;
  savedByCaching: number;

  status: 'success' | 'error';
  errorMessage?: string;
  duration?: number;
  metadata?: {
    usedModels: string[];
    [key: string]: unknown;
  };
}
