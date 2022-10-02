declare global {
  namespace jest {
    interface Expect {
      isPositiveNumber: () => CustomMatcherResult;
      closeToNow: (opts?: { deltaInSec: number }) => CustomMatcherResult;
    }
  }
}

export {};
