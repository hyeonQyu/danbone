export const checkResultFulfilled =
  <T>() =>
  (result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> =>
    result.status === 'fulfilled';

export const checkResultRejected =
  <T>() =>
  (result: PromiseSettledResult<T>): result is PromiseRejectedResult =>
    result.status === 'rejected';
