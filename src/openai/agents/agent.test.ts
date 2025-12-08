import { Agent } from '@openai/agents';

export const testAgent = new Agent({
  name: 'test',
  instructions: 'You are a test agent.',
  model: 'gpt-5-nano',
});
