import { assertNonNullable, assertNotEmpty } from './assert.helper';

describe('AssertHelper', () => {
  const nullMessage = 'Must not be null';
  const undefinedMessage = 'Must not be undefined';
  const notEmptyMessage = 'Must not be empty';
  describe('assertNonNullable()', () => {
    test('should throw an error when the given value is null', () => {
      expect(() => assertNonNullable(null, nullMessage)).toThrowError(nullMessage);
    });

    test('should throw an error when the given value is undefined', () => {
      expect(() => assertNonNullable(undefined, undefinedMessage)).toThrowError(undefinedMessage);
    });

    test('should not throw any error when the given value is neither null, nor undefined', () => {
      expect(() => assertNonNullable('anything', nullMessage)).not.toThrowError(nullMessage);
    });
  });

  describe('assertNotEmpty()', () => {
    test('should throw an error when the given value is null', () => {
      expect(() => assertNotEmpty(null, nullMessage)).toThrowError(nullMessage);
    });

    test('should throw an error when the given value is undefined', () => {
      expect(() => assertNotEmpty(null, undefinedMessage)).toThrowError(undefinedMessage);
    });

    test('should throw an error when the given array is empty', () => {
      expect(() => assertNotEmpty([], notEmptyMessage)).toThrowError(notEmptyMessage);
    });

    test('should throw an error when the given string is empty', () => {
      expect(() => assertNotEmpty('   ', notEmptyMessage)).toThrowError(notEmptyMessage);
    });

    test('should not throw any error when the given value is neither null, nor undefined', () => {
      expect(() => assertNotEmpty([1, '2', 3, '', 4], undefinedMessage)).not.toThrowError(undefinedMessage);
    });
  });
});
