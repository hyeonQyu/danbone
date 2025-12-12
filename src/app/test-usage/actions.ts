'use server';

import { searchInputGuardrail } from '@/openai/agents';
import { createRunner } from '@/openai/runner.utils';

export async function testUsageAction(input: string) {
  const runner = createRunner();
  const result = await runner.run(searchInputGuardrail, input);

  const usage = result.state.usage;

  // 콘솔에 출력
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Usage 전체 구조:');
  console.log(JSON.stringify(usage, null, 2));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 inputTokensDetails:');
  console.log(JSON.stringify(usage.inputTokensDetails, null, 2));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 outputTokensDetails:');
  console.log(JSON.stringify(usage.outputTokensDetails, null, 2));

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 requestUsageEntries:');
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
  console.log('✅ 결과:', result.finalOutput);

  // 클라이언트에 반환
  return {
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
}
