import { UsageLogEntity } from '@/openai/tracking';

export interface CreateUsageLogData {
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

export interface UsageLogQueryOptions {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  orderBy?: 'asc' | 'desc';
}

export interface UsageLogsServerRepository {
  createUsageLog: (data: CreateUsageLogData) => Promise<UsageLogEntity>;
  getUsageLogsByUserId: (userId: string, options?: UsageLogQueryOptions) => Promise<UsageLogEntity[]>;
  getUsageLogsByFeature: (feature: string, options?: UsageLogQueryOptions) => Promise<UsageLogEntity[]>;
  getUsageLogsByUserIdAndFeature: (userId: string, feature: string, options?: UsageLogQueryOptions) => Promise<UsageLogEntity[]>;
}
