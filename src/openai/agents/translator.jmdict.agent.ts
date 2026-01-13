import { buildAgentFactory } from '@/openai/agent.utils';

export const jmtdictTranslatorAgent = buildAgentFactory(
  {
    name: 'JMdict Translator',
    outputType: undefined,
  },
  [],
);
