import { PerformanceHelper } from 'src/helper/performance.helper';

describe('PerformanceHelper', () => {
  describe('measureDuration()', () => {
    it('should capture nano seconds', () => {
      const secondPart = 1;
      const nanoSecondPart = 222333444;
      jest.spyOn(process, 'hrtime').mockReturnValue([secondPart, nanoSecondPart]);

      const [_, duration] = PerformanceHelper.measureDuration(() => 1);
      expect(duration).toStrictEqual(1.222333444);
    });

    it('should return function result along with duration', () => {
      const secondPart = 0;
      const nanoSecondPart = 999999999;
      const mockFnResult = { hello: 'world' };
      jest.spyOn(process, 'hrtime').mockReturnValue([secondPart, nanoSecondPart]);

      const [actualFnResult, duration] = PerformanceHelper.measureDuration(() => mockFnResult);
      expect(duration).toStrictEqual(0.999999999);
      expect(actualFnResult).toStrictEqual(mockFnResult);
    });
  });
});
