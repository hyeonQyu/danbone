import { verifyAuth } from '@/auth/server.auth.utils';
import { usageLogsServerRepository } from '@/data/server/repositories/usage-logs';
import { createUsageLogServerService } from '@/data/server/services/usage-log';
import { getTrackingContext, runWithTrackingContext } from '@/openai/tracking/tracking.context';
import { AccumulatedUsage, TrackingState } from '@/openai/tracking/tracking.types';
import { randomUUID } from 'crypto';

const usageLogService = createUsageLogServerService({ usageLogsRepository: usageLogsServerRepository });

interface StartTrackingOptions {
  feature: string;
  userId: string;
  metadata?: Record<string, unknown>;
}

const startTracking = (options: StartTrackingOptions): TrackingState => {
  const context = getTrackingContext();

  if (context && context.status === 'tracking') {
    console.warn('[Usage Tracker] 이미 트래킹 중입니다. startTracking 호출을 무시합니다.');
    return context;
  }

  const state: TrackingState = {
    trackingId: randomUUID(),
    feature: options.feature,
    userId: options.userId,
    status: 'tracking',
    startTime: Date.now(),
    metadata: options.metadata,
    totalRegularInputTokens: 0,
    totalCachedInputTokens: 0,
    totalOutputTokens: 0,
    totalRegularInputCost: 0,
    totalCachedInputCost: 0,
    totalOutputCost: 0,
    totalSavedByCaching: 0,
    usedModels: new Set(),
  };

  return state;
};

const endTracking = async (status: 'success' | 'error', errorMessage?: string): Promise<void> => {
  const context = getTrackingContext();

  if (!context) {
    console.warn('[Usage Tracker] 트래킹 컨텍스트를 찾을 수 없습니다. endTracking 호출을 무시합니다.');
    return;
  }

  if (context.status === 'completed' || context.status === 'error') {
    console.warn('[Usage Tracker] 트래킹이 이미 종료되었습니다. endTracking 호출을 무시합니다.');
    return;
  }

  const duration = Date.now() - context.startTime;

  context.status = status === 'success' ? 'completed' : 'error';

  try {
    await usageLogService.logUsage({
      userId: context.userId,
      feature: context.feature,
      regularInputTokens: context.totalRegularInputTokens,
      cachedInputTokens: context.totalCachedInputTokens,
      outputTokens: context.totalOutputTokens,
      totalTokens: context.totalRegularInputTokens + context.totalCachedInputTokens + context.totalOutputTokens,
      regularInputCost: context.totalRegularInputCost,
      cachedInputCost: context.totalCachedInputCost,
      outputCost: context.totalOutputCost,
      totalCost: context.totalRegularInputCost + context.totalCachedInputCost + context.totalOutputCost,
      savedByCaching: context.totalSavedByCaching,
      status,
      ...(errorMessage && { errorMessage }),
      duration,
      metadata: {
        usedModels: Array.from(context.usedModels),
        ...context.metadata,
      },
    });
  } catch (error) {
    console.error('[Usage Tracker] 사용량 로그 기록에 실패했습니다:', error);
  }
};

export const getAccumulatedUsage = (): AccumulatedUsage | null => {
  const context = getTrackingContext();

  if (!context) {
    return null;
  }

  return {
    regularInputTokens: context.totalRegularInputTokens,
    cachedInputTokens: context.totalCachedInputTokens,
    outputTokens: context.totalOutputTokens,
    totalTokens: context.totalRegularInputTokens + context.totalCachedInputTokens + context.totalOutputTokens,
    regularInputCost: context.totalRegularInputCost,
    cachedInputCost: context.totalCachedInputCost,
    outputCost: context.totalOutputCost,
    totalCost: context.totalRegularInputCost + context.totalCachedInputCost + context.totalOutputCost,
    savedByCaching: context.totalSavedByCaching,
    usedModels: Array.from(context.usedModels),
    duration: Date.now() - context.startTime,
  };
};

export const runWithTracking = async <T>(options: StartTrackingOptions, callback: () => Promise<T>): Promise<T> => {
  const state = startTracking(options);

  return runWithTrackingContext(state, async () => {
    try {
      const result = await callback();
      await endTracking('success');
      return result;
    } catch (error) {
      await endTracking('error', error instanceof Error ? error.message : String(error));
      throw error;
    }
  });
};

export interface WithUsageTrackingOptions<TInput = unknown> {
  extractMetadata?: (input: TInput) => Record<string, unknown>;
  getUserId?: () => Promise<string | null>;
}

const defaultGetUserId = async (): Promise<string | null> => {
  try {
    const { uid } = await verifyAuth();
    return uid;
  } catch (error) {
    console.error('[withUsageTracking] user id 확인에 실패했습니다.', error);
    return null;
  }
};

export const withUsageTracking = <TInput = unknown, TOutput = unknown>(
  feature: string,
  handler: (input: TInput) => Promise<TOutput>,
  options?: WithUsageTrackingOptions<TInput>,
) => {
  return async (input: TInput): Promise<TOutput> => {
    const getUserId = options?.getUserId || defaultGetUserId;
    const userId = await getUserId();

    if (!userId) {
      console.log(`[withUsageTracking] 로그 트래킹을 진행하지 않습니다.\nfeature: "${feature}"\nno userId`);
      return handler(input);
    }

    const metadata = options?.extractMetadata?.(input) || {};

    const trackingOptions: StartTrackingOptions = {
      feature,
      userId,
      metadata,
    };

    return runWithTracking(trackingOptions, () => handler(input));
  };
};
