'use server';

import { createAgentQueryClassifier, createAgentSearchInputGuardrail } from '@/openai/agents';
import { TextModel } from '@/openai/model.types';
import { createRunner } from '@/openai/runner.utils';

const agentCreators = {
  searchInputGuardrail: createAgentSearchInputGuardrail,
  queryClassifier: createAgentQueryClassifier,
} as const;

export type AgentName = keyof typeof agentCreators;

// 각 에이전트가 지원하는 모델 정보를 추출
export async function getSupportedModels(agentName: AgentName): Promise<TextModel[]> {
  const agentCreator = agentCreators[agentName];
  // 임의의 모델로 한 번 호출해서 supportedModels를 얻음
  const dummyModel = 'gpt-5-nano' as TextModel;
  const { supportedModels } = agentCreator(dummyModel);
  return supportedModels as TextModel[];
}

export async function testUsageAction(input: string, agentName: AgentName, models: TextModel[]) {
  const runner = createRunner();
  const agentCreator = agentCreators[agentName];

  // 모든 모델에 대해 병렬로 실행
  const results = await Promise.all(
    models.map(async (model) => {
      const { agent } = agentCreator(model);
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
