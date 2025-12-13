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

      // 모든 테스트 케이스 실행
      const evaluations = await Promise.all(
        cases.map(async (testCase) => {
          try {
            const result = await runner.run(agent, testCase.input);
            const actualOutput = result.finalOutput;

            // 출력 비교 (유연한 비교)
            const passed = compareOutputs(testCase.expectedOutput, actualOutput, agentName);

            return {
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput,
              passed,
              description: testCase.description,
            } as EvaluationResult<unknown>;
          } catch (error) {
            return {
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: null,
              passed: false,
              description: testCase.description,
              error: error instanceof Error ? error.message : String(error),
            } as EvaluationResult<unknown>;
          }
        }),
      );

      // 정확도 계산
      const passedCount = evaluations.filter((e) => e.passed).length;
      const totalCount = evaluations.length;
      const accuracy = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

      // 토큰 사용량 및 비용 계산 (첫 번째 테스트 케이스로 샘플링)
      const sampleResult = await runner.run(agent, cases[0].input);
      const usage = sampleResult.state.usage;

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📊 [${model}] 평가 결과:`);
      console.log(`정확도: ${accuracy.toFixed(1)}% (${passedCount}/${totalCount})`);
      console.log(`평균 토큰 사용량 (샘플 기준):`);
      console.log(`  - 입력: ${usage.inputTokens}`);
      console.log(`  - 출력: ${usage.outputTokens}`);
      console.log(`  - 총: ${usage.totalTokens}`);

      return {
        model,
        accuracy,
        passedCount,
        totalCount,
        evaluations,
        usage: {
          requests: usage.requests,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
          totalTokens: usage.totalTokens,
          inputTokensDetails: usage.inputTokensDetails,
          outputTokensDetails: usage.outputTokensDetails,
        },
        priceBreakdown: sampleResult.priceBreakdown,
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
