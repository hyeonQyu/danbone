import { TextModel } from '@/openai/model.types';
import { PriceBreakdown } from '@/openai/runner.utils';
import { TrackingState } from '@/openai/tracking/tracking.types';
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage<TrackingState>();

export const getTrackingContext = (): TrackingState | undefined => {
  return asyncLocalStorage.getStore();
};

export const checkIsTracking = (): boolean => {
  const context = getTrackingContext();
  return context?.status === 'tracking';
};

export const runWithTrackingContext = <T>(state: TrackingState, callback: () => T): T => {
  return asyncLocalStorage.run(state, callback);
};

export const accumulatePriceBreakdown = (breakdown: PriceBreakdown, model: TextModel): void => {
  const context = getTrackingContext();

  if (!context || context.status !== 'tracking') {
    return;
  }

  context.totalRegularInputTokens += breakdown.regularInputTokens;
  context.totalCachedInputTokens += breakdown.cachedInputTokens;
  context.totalOutputTokens += breakdown.outputTokens;
  context.totalRegularInputCost += breakdown.regularInputCost;
  context.totalCachedInputCost += breakdown.cachedInputCost;
  context.totalOutputCost += breakdown.outputCost;
  context.totalSavedByCaching += breakdown.savedByCaching;
  context.usedModels.add(model);
};
