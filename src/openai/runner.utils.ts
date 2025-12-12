import { TextModel } from '@/openai/model.types';
import { TEXT_STANDARD_USD_PRICE, TEXT_TOKEN_UNIT } from '@/openai/pricing.constants';
import { Runner, Usage } from '@openai/agents';

interface PriceBreakdown {
  regularInputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  regularInputCost: number;
  cachedInputCost: number;
  outputCost: number;
  totalCost: number;
  savedByCaching: number;
}

const calculatePrice = (usage: Usage, model: TextModel): PriceBreakdown => {
  const pricing = TEXT_STANDARD_USD_PRICE[model];

  const cachedInputTokens = usage.inputTokensDetails.reduce((sum, details) => sum + (details.cached_tokens ?? 0), 0);

  const regularInputTokens = usage.inputTokens - cachedInputTokens;

  const regularInputCost = (regularInputTokens / TEXT_TOKEN_UNIT) * pricing.input;
  const cachedInputCost = (cachedInputTokens / TEXT_TOKEN_UNIT) * pricing.cachedInput;
  const outputCost = (usage.outputTokens / TEXT_TOKEN_UNIT) * pricing.output;
  const totalCost = regularInputCost + cachedInputCost + outputCost;

  const savedByCaching = (cachedInputTokens / TEXT_TOKEN_UNIT) * (pricing.input - pricing.cachedInput);

  return {
    regularInputTokens,
    cachedInputTokens,
    outputTokens: usage.outputTokens,
    regularInputCost,
    cachedInputCost,
    outputCost,
    totalCost,
    savedByCaching,
  };
};

export const createRunner = () => {
  const runner = new Runner();

  const run = async <TAgent extends Parameters<typeof runner.run>[0]>(
    agent: TAgent,
    input: Parameters<typeof runner.run>[1],
    options?: Parameters<typeof runner.run>[2],
  ) => {
    const result = await runner.run(agent, input, options);

    const agentModel = agent.model;
    let priceBreakdown: PriceBreakdown | undefined;

    if (typeof agentModel === 'string' && agentModel in TEXT_STANDARD_USD_PRICE) {
      priceBreakdown = calculatePrice(result.state.usage, agentModel as TextModel);
    }

    return Object.assign(result, { priceBreakdown });
  };

  return {
    ...runner,
    run,
  };
};
