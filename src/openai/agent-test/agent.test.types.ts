export type TestCase<TOutput, TInput = string> = {
  input: TInput;
  expectedOutput: TOutput;
  description?: string;
};

export type EvaluationResult<TOutput, TInput = string> = {
  input: TInput;
  expectedOutput: TOutput;
  actualOutput: TOutput;
  passed: boolean;
  description?: string;
  error?: string;
};
