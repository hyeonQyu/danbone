import { CreateUsageLogData, UsageLogsServerRepository } from '@/data/server/repositories/usage-logs';
import { UsageLogEntity } from '@/openai/tracking';

export interface UsageLogServerServiceDependencies {
  usageLogsRepository: UsageLogsServerRepository;
}

export interface UsageSummary {
  totalCost: number;
  totalTokens: number;
  totalRequests: number;
  regularInputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  regularInputCost: number;
  cachedInputCost: number;
  outputCost: number;
  savedByCaching: number;
  successfulRequests: number;
  failedRequests: number;
}

export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface UsageLogServerService {
  logUsage: (data: CreateUsageLogData) => Promise<UsageLogEntity>;
  getUserUsageSummary: (userId: string, dateRange?: DateRange) => Promise<UsageSummary>;
  getFeatureUsageSummary: (feature: string, dateRange?: DateRange) => Promise<UsageSummary>;
}
