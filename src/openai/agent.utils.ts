import { TextModel } from '@/openai/model.types';
import { Agent, AgentOptions, AgentOutputType, UnknownContext } from '@openai/agents';
import { TextOutput } from '@openai/agents-core';

type AgentCommonOptions<TContext = UnknownContext, TOutput extends AgentOutputType = TextOutput> = Omit<
  AgentOptions<TContext, TOutput>,
  'model' | 'instructions' | 'modelSettings'
>;

export type AgentConfiguration<
  TConfigId extends string = string,
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
> = {
  id: TConfigId;
  label?: string;
  model: TextModel;
  instructions: string;
  modelSettings?: AgentOptions<TContext, TOutput>['modelSettings'];
};

export const buildAgentFactory = <
  TConfig extends AgentConfiguration<string, TContext, TOutput>,
  TContext = UnknownContext,
  TOutput extends AgentOutputType = TextOutput,
>(
  agentConfig: AgentCommonOptions<TContext, TOutput>,
  modelConfigs: readonly TConfig[],
) => {
  const modelConfigMap = new Map(modelConfigs.map((c) => [c.id, c]));

  return {
    agentType: agentConfig.name,
    supportedConfigurations: modelConfigs.map(({ id, label, model }) => ({ id, label, model })),
    createAgent: (configId: TConfig['id']) => {
      const modelConfig = modelConfigMap.get(configId);

      if (!modelConfig) {
        throw new Error(`Configuration not found: ${configId}`);
      }

      return new Agent({ ...agentConfig, ...modelConfig });
    },
  };
};
