export class PerformanceHelper {
  /**
   * Measure the duration of a function call. The duration is in seconds
   * but also capture nano milliseconds.
   */
  static measureDuration<T>(fn: () => T): [T, number] {
    const startTime = process.hrtime();
    const result = fn();
    const [secondPart, nanoSecondPart] = process.hrtime(startTime);

    const nanoSecondPerSecond = 1e9;
    const duration = secondPart + nanoSecondPart / nanoSecondPerSecond;
    return [result, duration];
  }
}
