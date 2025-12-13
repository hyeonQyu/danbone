import { TextModel } from '@/openai/model.types';
import { Agent, AgentOptions, AgentOutputType, UnknownContext } from '@openai/agents';
import { TextOutput } from '@openai/agents-core';

type AgentCommonOptions<TContext = UnknownContext, TOutput extends AgentOutputType = TextOutput> = Omit<
  AgentOptions<TContext, TOutput>,
  'model' | 'instructions'
>;

type AgentModelOptions<TContext = UnknownContext, TOutput extends AgentOutputType = TextOutput> = Pick<
  AgentOptions<TContext, TOutput>,
  'instructions'
>;

export const buildAgentFactory = <TContext = UnknownContext, TOutput extends AgentOutputType = TextOutput>(
  config: AgentCommonOptions<TContext, TOutput>,
  configByModel: Partial<Record<TextModel, AgentModelOptions<TContext, TOutput>>>,
) => {
  return {
    createAgent: (model: TextModel) => new Agent({ ...config, ...configByModel[model], model }),
    supportedModels: Object.keys(configByModel),
  };
};
