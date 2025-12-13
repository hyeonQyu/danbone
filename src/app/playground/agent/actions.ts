'use server';

import { queryClassifierTestCases, searchInputGuardrailTestCases, type EvaluationResult } from '@/openai/agent-test';
import { queryClassifierAgentFactory, searchInputGuardrailAgentFactory } from '@/openai/agents';
import { TextModel } from '@/openai/model.types';
import { createRunner } from '@/openai/runner.utils';

const agentCreators = {
  searchInputGuardrail: searchInputGuardrailAgentFactory,
  queryClassifier: queryClassifierAgentFactory,
} as const;

const testCases = {
  searchInputGuardrail: searchInputGuardrailTestCases,
  queryClassifier: queryClassifierTestCases,
} as const;

export type AgentName = keyof typeof agentCreators;

// 각 에이전트가 지원하는 모델 정보를 추출
export async function getSupportedModels(agentName: AgentName): Promise<TextModel[]> {
  const agentCreator = agentCreators[agentName];
  return agentCreator.supportedModels as TextModel[];
}

export async function testUsageAction(input: string, agentName: AgentName, models: TextModel[]) {
  const runner = createRunner();
  const agentCreator = agentCreators[agentName];

  // 모든 모델에 대해 병렬로 실행
  const results = await Promise.all(
    models.map(async (model) => {
      const agent = agentCreator.createAgent(model);
      const result = await runner.run(agent, input);
      const usage = result.state.usage;

      // 콘솔에 출력
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] Usage 전체 구조:`);
      console.log(JSON.stringify(usage, null, 2));

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] inputTokensDetails:`);
      console.log(JSON.stringify(usage.inputTokensDetails, null, 2));

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] outputTokensDetails:`);
      console.log(JSON.stringify(usage.outputTokensDetails, null, 2));

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] requestUsageEntries:`);
      if (usage.requestUsageEntries) {
        usage.requestUsageEntries.forEach((entry, i) => {
          console.log(`\nRequest ${i + 1}:`);
          console.log(JSON.stringify(entry, null, 2));
          console.log('inputTokensDetails keys:', Object.keys(entry.inputTokensDetails || {}));
          console.log('outputTokensDetails keys:', Object.keys(entry.outputTokensDetails || {}));
        });
      } else {
        console.log('undefined');
      }

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ [${model}] 결과:`, result.finalOutput);

      return {
        model,
        success: true,
        usage: {
          requests: usage.requests,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          inputTokensDetails: usage.inputTokensDetails,
          outputTokensDetails: usage.outputTokensDetails,
          requestUsageEntries: usage.requestUsageEntries?.map((entry) => ({
            inputTokens: entry.inputTokens,
            outputTokens: entry.outputTokens,
            totalTokens: entry.totalTokens,
            inputTokensDetails: entry.inputTokensDetails,
            outputTokensDetails: entry.outputTokensDetails,
          })),
        },
        priceBreakdown: result.priceBreakdown,
        result: result.finalOutput,
      };
    }),
  );

  return results;
}

// 테스트 케이스 가져오기
export async function getTestCases(agentName: AgentName) {
  return testCases[agentName];
}

// 테스트 평가 실행
export async function evaluateAgentAction(agentName: AgentName, models: TextModel[]) {
  const runner = createRunner();
  const agentCreator = agentCreators[agentName];
  const cases = testCases[agentName];

  // 모든 모델에 대해 평가
  const results = await Promise.all(
    models.map(async (model) => {
      const agent = agentCreator.createAgent(model);

      // 모든 테스트 케이스 실행 및 토큰 사용량/비용 수집
      const evaluationsWithMetrics = await Promise.all(
        cases.map(async (testCase) => {
          try {
            const result = await runner.run(agent, testCase.input);
            const actualOutput = result.finalOutput;

            // 출력 비교 (유연한 비교)
            const passed = compareOutputs(testCase.expectedOutput, actualOutput, agentName);

            return {
              evaluation: {
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput,
                passed,
                description: testCase.description,
              } as EvaluationResult<unknown>,
              usage: result.state.usage,
              priceBreakdown: result.priceBreakdown,
            };
          } catch (error) {
            return {
              evaluation: {
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: null,
                passed: false,
                description: testCase.description,
                error: error instanceof Error ? error.message : String(error),
              } as EvaluationResult<unknown>,
              usage: null,
              priceBreakdown: null,
            };
          }
        }),
      );

      const evaluations = evaluationsWithMetrics.map((e) => e.evaluation);

      // 정확도 계산
      const passedCount = evaluations.filter((e) => e.passed).length;
      const totalCount = evaluations.length;
      const accuracy = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

      // 토큰 사용량 및 비용 계산 (평균과 총합)
      const validMetrics = evaluationsWithMetrics.filter((e) => e.usage && e.priceBreakdown);
      const totalInputTokens = validMetrics.reduce((sum, e) => sum + (e.usage?.inputTokens || 0), 0);
      const totalOutputTokens = validMetrics.reduce((sum, e) => sum + (e.usage?.outputTokens || 0), 0);
      const totalAllTokens = validMetrics.reduce((sum, e) => sum + (e.usage?.totalTokens || 0), 0);
      const totalCost = validMetrics.reduce((sum, e) => sum + (e.priceBreakdown?.totalCost || 0), 0);
      const totalRegularInputTokens = validMetrics.reduce((sum, e) => sum + (e.priceBreakdown?.regularInputTokens || 0), 0);
      const totalCachedInputTokens = validMetrics.reduce((sum, e) => sum + (e.priceBreakdown?.cachedInputTokens || 0), 0);
      const totalOutputTokensForPrice = validMetrics.reduce((sum, e) => sum + (e.priceBreakdown?.outputTokens || 0), 0);
      const totalSavedByCaching = validMetrics.reduce((sum, e) => sum + (e.priceBreakdown?.savedByCaching || 0), 0);

      const avgInputTokens = validMetrics.length > 0 ? Math.round(totalInputTokens / validMetrics.length) : 0;
      const avgOutputTokens = validMetrics.length > 0 ? Math.round(totalOutputTokens / validMetrics.length) : 0;
      const avgTotalTokens = validMetrics.length > 0 ? Math.round(totalAllTokens / validMetrics.length) : 0;
      const avgCost = validMetrics.length > 0 ? totalCost / validMetrics.length : 0;

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] 평가 결과:`);
      console.log(`정확도: ${accuracy.toFixed(1)}% (${passedCount}/${totalCount})`);
      console.log(`토큰 사용량 평균:`);
      console.log(`  - 입력: ${avgInputTokens}`);
      console.log(`  - 출력: ${avgOutputTokens}`);
      console.log(`  - 총: ${avgTotalTokens}`);
      console.log(`토큰 사용량 총합:`);
      console.log(`  - 입력: ${totalInputTokens}`);
      console.log(`  - 출력: ${totalOutputTokens}`);
      console.log(`  - 총: ${totalAllTokens}`);
      console.log(`비용:`);
      console.log(`  - 평균: $${avgCost.toFixed(6)}`);
      console.log(`  - 총합: $${totalCost.toFixed(6)}`);

      return {
        model,
        accuracy,
        passedCount,
        totalCount,
        evaluations,
        usage: {
          avg: {
            requests: validMetrics[0]?.usage?.requests || 0,
            inputTokens: avgInputTokens,
            outputTokens: avgOutputTokens,
            totalTokens: avgTotalTokens,
          },
          total: {
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            totalTokens: totalAllTokens,
          },
        },
        priceBreakdown: {
          avg: {
            regularInputTokens: validMetrics.length > 0 ? Math.round(totalRegularInputTokens / validMetrics.length) : 0,
            cachedInputTokens: validMetrics.length > 0 ? Math.round(totalCachedInputTokens / validMetrics.length) : 0,
            outputTokens: validMetrics.length > 0 ? Math.round(totalOutputTokensForPrice / validMetrics.length) : 0,
            totalCost: avgCost,
            savedByCaching: validMetrics.length > 0 ? totalSavedByCaching / validMetrics.length : 0,
          },
          total: {
            regularInputTokens: totalRegularInputTokens,
            cachedInputTokens: totalCachedInputTokens,
            outputTokens: totalOutputTokensForPrice,
            totalCost: totalCost,
            savedByCaching: totalSavedByCaching,
          },
        },
      };
    }),
  );

  return results;
}

// 타입 가드
function isGuardrailOutput(obj: unknown): obj is { valid: boolean; message: string } {
  return typeof obj === 'object' && obj !== null && 'valid' in obj && typeof (obj as { valid: unknown }).valid === 'boolean';
}

function isQueryClassifierOutput(obj: unknown): obj is { unit: string; lang: string; text: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'unit' in obj &&
    'lang' in obj &&
    'text' in obj &&
    typeof (obj as { text: unknown }).text === 'string'
  );
}

// 출력 비교 함수 (에이전트별로 다른 로직)
function compareOutputs(expected: unknown, actual: unknown, agentName: AgentName): boolean {
  if (!actual) return false;

  if (agentName === 'searchInputGuardrail') {
    // valid 필드만 비교 (message는 유연하게)
    if (isGuardrailOutput(expected) && isGuardrailOutput(actual)) {
      return expected.valid === actual.valid;
    }
    return false;
  }

  if (agentName === 'queryClassifier') {
    // unit과 lang은 정확히 일치해야 함
    // text는 여러 정답이 있을 수 있으므로 유연하게 (비어있지 않으면 OK)
    if (isQueryClassifierOutput(expected) && isQueryClassifierOutput(actual)) {
      return expected.unit === actual.unit && expected.lang === actual.lang && Boolean(actual.text && actual.text.length > 0);
    }
    return false;
  }

  // 기본: JSON 문자열 비교
  return JSON.stringify(expected) === JSON.stringify(actual);
}
