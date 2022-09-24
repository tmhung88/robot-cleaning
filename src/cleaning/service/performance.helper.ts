export class PerformanceHelper {
  static measureDuration<T>(fn: () => T): [T, number] {
    const startTime = process.hrtime();
    const result = fn();
    const [secondPart, nanoSecondPart] = process.hrtime(startTime);

    const nanoSecondPerSecond = 1e9;
    const duration = secondPart + nanoSecondPart / nanoSecondPerSecond;
    return [result, duration];
  }
}
