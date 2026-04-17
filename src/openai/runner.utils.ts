import { TextModel } from '@/openai/model.types';
import { TEXT_STANDARD_USD_PRICE, TEXT_TOKEN_UNIT } from '@/openai/pricing.constants';
import { accumulatePriceBreakdown, checkIsTracking } from '@/openai/tracking';
import { Agent, AgentOutputType, Runner, Usage } from '@openai/agents';

export interface PriceBreakdown {
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

const createRunner = () => {
  const runner = new Runner();

  const run = async <TContext, TOutput extends AgentOutputType>(
    agent: Agent<TContext, TOutput>,
    input: string,
    options?: Parameters<typeof runner.run>[2],
  ) => {
    const result = await runner.run(agent, input, options);

    const agentModel = agent.model;
    let priceBreakdown: PriceBreakdown | undefined;

    if (typeof agentModel === 'string' && agentModel in TEXT_STANDARD_USD_PRICE) {
      const model = agentModel as TextModel;
      priceBreakdown = calculatePrice(result.state.usage, model);

      if (checkIsTracking() && priceBreakdown) {
        accumulatePriceBreakdown(priceBreakdown, model);
      }
    }

    return Object.assign(result, { priceBreakdown });
  };

  return {
    ...runner,
    run,
  };
};

const runner = createRunner();

export const getRunner = () => runner;
