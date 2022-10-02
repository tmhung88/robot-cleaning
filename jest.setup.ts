import 'reflect-metadata';
import CustomMatcherResult = jest.CustomMatcherResult;

expect.extend({
  isPositiveNumber(received: number): CustomMatcherResult {
    return {
      pass: received > 0,
      message: () => `expected ${received} to be a positive number`,
    };
  },

  closeToNow(received: string, opts?: { deltaInSec: number }): CustomMatcherResult {
    const defaultOpts = { deltaInSec: 10 };
    const expectedDeltaInSec = opts?.deltaInSec ?? defaultOpts.deltaInSec;
    const receivedDate = new Date(received);
    const actualDelta = Math.abs(Date.now() - receivedDate.getTime()) / 1000;
    return {
      pass: actualDelta < expectedDeltaInSec,
      message: () => `expected ${received} within ${expectedDeltaInSec} from Date.now()`,
    };
  },
});
