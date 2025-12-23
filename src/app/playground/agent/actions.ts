'use server';

import {
  dictionaryJaTestCases,
  inputValidatorTestCases,
  morphAnalyzerJaTestCases,
  queryNormalizerTestCases,
  translatorTestCases,
  type EvaluationResult,
} from '@/openai/agent-test';
import {
  inputValidatorAgentFactory,
  jaDictionaryAgentFactory,
  jaMorphologicalAnalyzerAgentFactory,
  queryNormalizerAgentFactory,
  translatorAgentFactory,
} from '@/openai/agents';
import { TextModel } from '@/openai/model.types';
import { getRunner } from '@/openai/runner.utils';

const agentCreators = {
  queryNormalizer: queryNormalizerAgentFactory,
  inputValidator: inputValidatorAgentFactory,
  translator: translatorAgentFactory,
  morphAnalyzer: jaMorphologicalAnalyzerAgentFactory,
  dictionaryJa: jaDictionaryAgentFactory,
} as const;

const testCases = {
  queryNormalizer: queryNormalizerTestCases,
  inputValidator: inputValidatorTestCases,
  translator: translatorTestCases,
  morphAnalyzer: morphAnalyzerJaTestCases,
  dictionaryJa: dictionaryJaTestCases,
} as const;

export type AgentName = keyof typeof agentCreators;

// 각 에이전트가 지원하는 모델 정보를 추출
export async function getSupportedModels(agentName: AgentName): Promise<TextModel[]> {
  const agentCreator = agentCreators[agentName];
  return agentCreator.supportedModels as TextModel[];
}

export async function testUsageAction(input: string, agentName: AgentName, models: TextModel[]) {
  const runner = getRunner();
  const agentCreator = agentCreators[agentName];

  // 모든 모델에 대해 병렬로 실행
  const results = await Promise.all(
    models.map(async (model) => {
      const agent = agentCreator.createAgent(model);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await runner.run(agent as any, input);
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
  const runner = getRunner();
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
            // input이 객체인 경우 JSON 문자열로 변환
            const inputStr = typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = await runner.run(agent as any, inputStr);
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
              } as EvaluationResult<unknown, unknown>,
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
              } as EvaluationResult<unknown, unknown>,
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

// 커스텀 비교 함수 타입
// path: 현재 비교 중인 필드의 경로 (예: ['category', 'items', '0'])
// 반환값: true/false로 비교 결과를 반환하거나, undefined를 반환하면 기본 로직 사용
type CustomComparator = (expected: unknown, actual: unknown, path: string[]) => boolean | undefined;

// 에이전트별 커스텀 비교 함수 (필요시 여기에 추가)
const customComparators: Partial<Record<AgentName, CustomComparator>> = {
  // 예시: searchInputGuardrail의 경우 특정 필드를 다르게 비교
  // searchInputGuardrail: (expected, actual, path) => {
  //   // 예: 'tags' 필드는 배열 순서 무시하고 비교
  //   if (path[path.length - 1] === 'tags') {
  //     if (Array.isArray(expected) && Array.isArray(actual)) {
  //       return JSON.stringify([...expected].sort()) === JSON.stringify([...actual].sort());
  //     }
  //   }
  //   // undefined 반환 시 기본 로직 사용
  //   return undefined;
  // },
};

// 출력 비교 함수 (통일된 로직: JSON 객체의 모든 필드를 비교)
function compareOutputs(expected: unknown, actual: unknown, agentName: AgentName): boolean {
  if (!actual) return false;

  const customComparator = customComparators[agentName];

  // 재귀적으로 비교하는 내부 함수
  const compareWithPath = (exp: unknown, act: unknown, path: string[]): boolean => {
    // 커스텀 비교 함수가 있으면 먼저 시도
    if (customComparator) {
      const customResult = customComparator(exp, act, path);
      if (customResult !== undefined) {
        return customResult;
      }
    }

    // 기본 비교 로직
    if (exp === act) return true;
    if (exp === null || act === null) return false;
    if (exp === undefined || act === undefined) return false;

    const expType = typeof exp;
    const actType = typeof act;

    // 타입이 다르면 false
    if (expType !== actType) return false;

    // 객체가 아닌 경우 직접 비교
    if (expType !== 'object') {
      return exp === act;
    }

    // 배열인 경우
    if (Array.isArray(exp) && Array.isArray(act)) {
      if (exp.length !== act.length) return false;

      // 배열을 정렬해서 비교 (순서 무시)
      const sortedExp = sortArray(exp);
      const sortedAct = sortArray(act);

      return sortedExp.every((item, index) => compareWithPath(item, sortedAct[index], [...path, String(index)]));
    }

    // 한쪽만 배열이면 false
    if (Array.isArray(exp) || Array.isArray(act)) return false;

    // 객체인 경우
    const expObj = exp as Record<string, unknown>;
    const actObj = act as Record<string, unknown>;

    const expKeys = Object.keys(expObj).sort();
    const actKeys = Object.keys(actObj).sort();

    // 키 개수가 다르면 false
    if (expKeys.length !== actKeys.length) return false;

    // 키가 다르면 false
    if (expKeys.some((key, i) => key !== actKeys[i])) return false;

    // 모든 키에 대해 재귀적으로 비교
    return expKeys.every((key) => compareWithPath(expObj[key], actObj[key], [...path, key]));
  };

  return compareWithPath(expected, actual, []);
}

// 배열을 정렬하는 헬퍼 함수 (순서를 무시하고 비교하기 위해)
function sortArray(arr: unknown[]): unknown[] {
  return [...arr].sort((a, b) => {
    // null/undefined 처리
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    const aType = typeof a;
    const bType = typeof b;

    // 타입이 다르면 타입 이름으로 정렬
    if (aType !== bType) {
      return aType.localeCompare(bType);
    }

    // 원시 타입은 직접 비교
    if (aType === 'string') return (a as string).localeCompare(b as string);
    if (aType === 'number') return (a as number) - (b as number);
    if (aType === 'boolean') return Number(a) - Number(b);

    // 객체/배열은 JSON 문자열로 변환해서 비교
    try {
      return JSON.stringify(a).localeCompare(JSON.stringify(b));
    } catch {
      return 0;
    }
  });
}
