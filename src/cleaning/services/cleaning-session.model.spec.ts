import { CleaningSession } from 'src/cleaning/services/cleaning-session.model';
import { CleaningCommand, Direction } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { PerformanceHelper } from 'src/helper/performance.helper';

describe('CleaningSession', () => {
  const cleaningSession = new CleaningSession();

  describe('execute()', () => {
    const mockedDuration = 0.01111;
    beforeEach(() => {
      jest.spyOn(PerformanceHelper, 'measureDuration').mockImplementation((fn) => {
        return [fn(), mockedDuration];
      });
    });

    const assertExecution = (
      actualExecution: Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'>,
      expectExecution: { commands: number; uniqueVisits: number },
    ) => {
      expect(actualExecution).toStrictEqual({
        duration: mockedDuration,
        ...expectExecution,
      });
    };

    it('should track the initial starting point when no commands are given', () => {
      const actualExecution = cleaningSession.execute({ start: { x: -1, y: 14 }, commands: [] });
      assertExecution(actualExecution, {
        commands: 0,
        uniqueVisits: 1,
      });
    });

    it('should track unique visits', () => {
      const actualExecution = cleaningSession.execute({
        start: { x: 0, y: 0 },
        commands: [
          { steps: 2, direction: Direction.north },
          { steps: 1, direction: Direction.south },
          { steps: 1, direction: Direction.south },

          { steps: 2, direction: Direction.south },
          { steps: 1, direction: Direction.north },
          { steps: 1, direction: Direction.north },

          { steps: 2, direction: Direction.west },
          { steps: 1, direction: Direction.east },
          { steps: 1, direction: Direction.east },

          { steps: 2, direction: Direction.east },
          { steps: 1, direction: Direction.west },
          { steps: 1, direction: Direction.west },
        ],
      });
      assertExecution(actualExecution, {
        commands: 12,
        uniqueVisits: 9,
      });
    });

    it('should not track visits too far North', () => {
      const actualExecution = cleaningSession.execute({
        start: { x: 0, y: CleaningSession.MAX_Y },
        commands: [
          { steps: 1, direction: Direction.north },
          { steps: 2, direction: Direction.north },
        ],
      });
      assertExecution(actualExecution, {
        commands: 2,
        uniqueVisits: 1,
      });
    });

    it('should not track visits too far South', () => {
      const actualExecution = cleaningSession.execute({
        start: { x: 0, y: CleaningSession.MIN_Y },
        commands: [
          { steps: 4, direction: Direction.south },
          { steps: 2, direction: Direction.south },
        ],
      });
      assertExecution(actualExecution, {
        commands: 2,
        uniqueVisits: 1,
      });
    });

    it('should not track visits too far East', () => {
      const actualExecution = cleaningSession.execute({
        start: { x: CleaningSession.MAX_X, y: 0 },
        commands: [
          { steps: 1, direction: Direction.east },
          { steps: 1, direction: Direction.east },
        ],
      });
      assertExecution(actualExecution, {
        commands: 2,
        uniqueVisits: 1,
      });
    });

    it('should not track visits too far West', () => {
      const actualExecution = cleaningSession.execute({
        start: { x: CleaningSession.MIN_X, y: 0 },
        commands: [
          { steps: 1, direction: Direction.west },
          { steps: 1, direction: Direction.west },
        ],
      });
      assertExecution(actualExecution, {
        commands: 2,
        uniqueVisits: 1,
      });
    });

    it('should track unique visits when walking in up and down in a square', () => {
      const commands: CleaningCommand[] = [];
      for (let i = 0; i < 100; i++) {
        commands.push(
          { steps: 99, direction: Direction.north },
          { steps: 1, direction: Direction.east },
          { steps: 99, direction: Direction.south },
          { steps: 1, direction: Direction.east },
        );
      }

      const actualExecution = cleaningSession.execute({
        start: { x: -50, y: -50 },
        commands,
      });

      assertExecution(actualExecution, {
        commands: commands.length,
        uniqueVisits: 20001,
      });
    });

    /**
     * The performance test should have a separate pipeline and not part of unit testing.
     * The test validates if the algo performs cleaning in the worst scenario:
     * - MAX_COMMANDS * MAX_STEPS
     * - all visits are unique
     */
    it.skip('should track all unique visits MAX_COMMANDS * MAX_STEPS', () => {
      const farthestSouthWest = { x: CleaningSession.MIN_X, y: CleaningSession.MIN_Y };
      const maxCommands: CleaningCommand[] = [];
      // insert 4 commands with MAX_STEPS per loop
      // the commands with 1 step are insignificant, and not counted to total commands
      for (let i = 0; i < CleaningSession.MAX_COMMANDS / 4; i++) {
        maxCommands.push(
          { steps: CleaningSession.MAX_STEPS, direction: Direction.north },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.north },
          { steps: 1, direction: Direction.east },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.south },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.south },
          { steps: 1, direction: Direction.east },
        );
      }

      const actualExecution = cleaningSession.execute({
        start: farthestSouthWest,
        commands: maxCommands,
      });

      assertExecution(actualExecution, {
        commands: maxCommands.length,
        uniqueVisits: 999995001,
      });
    });
  });
});
