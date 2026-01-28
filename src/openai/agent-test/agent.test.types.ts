export type TestCase<TOutput> = {
  input: string;
  expectedOutput: TOutput;
  description?: string;
};

export type EvaluationResult<TOutput> = {
  input: string;
  expectedOutput: TOutput;
  actualOutput: TOutput;
  passed: boolean;
  description?: string;
  error?: string;
};
