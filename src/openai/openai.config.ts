import { setDefaultOpenAIClient } from '@openai/agents';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

setDefaultOpenAIClient(client);
