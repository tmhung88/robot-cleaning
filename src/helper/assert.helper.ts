import { AssertionError } from 'assert';

/**
 * Assert if a value is neither null, nor undefined
 * @param value - the given value
 * @param errorMessage - the error message which is thrown when the assertion fails
 */
export function assertNonNullable<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new AssertionError({ message: errorMessage });
  }
}

/**
 * Assert if an array or a string is neither empty, null, nor undefined
 * @param value - the given array, or string
 * @param errorMessage - the error message which is thrown when the assertion fails
 */
export function assertNotEmpty<T>(value: T, errorMessage: string): asserts value is NonNullable<T> {
  assertNonNullable(value, errorMessage);
  if (Array.isArray(value) && value.length === 0) {
    throw new AssertionError({ message: errorMessage });
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    throw new AssertionError({ message: errorMessage });
  }
}
