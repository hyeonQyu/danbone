import { getServerServiceCreator } from '@/data/server/services/server.service.utils';
import {
  UsageLogServerService,
  UsageLogServerServiceDependencies,
  UsageSummary,
} from '@/data/server/services/usage-log/server.usageLog.service.types';
import { UsageLogEntity } from '@/openai/tracking';

export const createUsageLogServerService = getServerServiceCreator<UsageLogServerService, UsageLogServerServiceDependencies>(
  ({ usageLogsRepository }) => {
    const calculateSummary = (logs: UsageLogEntity[]): UsageSummary => {
      return logs.reduce(
        (summary, log) => ({
          totalCost: summary.totalCost + log.totalCost,
          totalTokens: summary.totalTokens + log.totalTokens,
          totalRequests: summary.totalRequests + 1,
          regularInputTokens: summary.regularInputTokens + log.regularInputTokens,
          cachedInputTokens: summary.cachedInputTokens + log.cachedInputTokens,
          outputTokens: summary.outputTokens + log.outputTokens,
          regularInputCost: summary.regularInputCost + log.regularInputCost,
          cachedInputCost: summary.cachedInputCost + log.cachedInputCost,
          outputCost: summary.outputCost + log.outputCost,
          savedByCaching: summary.savedByCaching + log.savedByCaching,
          successfulRequests: summary.successfulRequests + (log.status === 'success' ? 1 : 0),
          failedRequests: summary.failedRequests + (log.status === 'error' ? 1 : 0),
        }),
        {
          totalCost: 0,
          totalTokens: 0,
          totalRequests: 0,
          regularInputTokens: 0,
          cachedInputTokens: 0,
          outputTokens: 0,
          regularInputCost: 0,
          cachedInputCost: 0,
          outputCost: 0,
          savedByCaching: 0,
          successfulRequests: 0,
          failedRequests: 0,
        } as UsageSummary,
      );
    };

    return {
      logUsage: async (data) => {
        return usageLogsRepository.createUsageLog(data);
      },

      getUserUsageSummary: async (userId, dateRange) => {
        const logs = await usageLogsRepository.getUsageLogsByUserId(userId, {
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return calculateSummary(logs);
      },

      getFeatureUsageSummary: async (feature, dateRange) => {
        const logs = await usageLogsRepository.getUsageLogsByFeature(feature, {
          startDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        });

        return calculateSummary(logs);
      },
    };
  },
);
