import { CleaningSession } from 'src/cleaning/service/cleaning-session.model';
import { PerformanceHelper } from 'src/cleaning/service/performance.helper';
import { CleaningCommand, Direction } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';

describe('CleaningSession', () => {

  describe('execute()', () => {
    const mockedDuration = 0.01111;
    beforeEach(() => {
      jest.spyOn(PerformanceHelper, 'measureDuration').mockImplementation(fn => {
        return [fn(), mockedDuration];
      });
    });

    const assertExecution = (actualExecution: Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'>,
                             expectExecution: { commands: number, uniqueVisits: number }) => {
      expect(actualExecution).toStrictEqual({
        'duration': mockedDuration,
        ...expectExecution,
      });
    };

    it('should track the initial starting point when no commands are given', () => {
      const actualExecution = CleaningSession.execute({ start: { x: -1, y: 14 }, commands: [] });
      assertExecution(actualExecution, {
        'commands': 0,
        'uniqueVisits': 1,
      });
    });

    it('should track unique visits', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: 0, y: 0 }, commands: [
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
        'commands': 12,
        'uniqueVisits': 9,
      });
    });

    it('should not track visits too far North', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: 0, y: CleaningSession.MAX_Y }, commands: [
          { steps: 1, direction: Direction.north },
          { steps: 2, direction: Direction.north },
        ],
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });

    it('should not track visits too far South', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: 0, y: CleaningSession.MIN_Y }, commands: [
          { steps: 4, direction: Direction.south },
          { steps: 2, direction: Direction.south },
        ],
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });

    it('should not track visits too far East', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: CleaningSession.MAX_X, y: 0 }, commands: [
          { steps: 1, direction: Direction.east },
          { steps: 1, direction: Direction.east },
        ],
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });

    it('should not track visits too far West', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: CleaningSession.MIN_X, y: 0 }, commands: [
          { steps: 1, direction: Direction.west },
          { steps: 1, direction: Direction.west },
        ],
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });

    it('should not track visits too far West', () => {
      const actualExecution = CleaningSession.execute({
        start: { x: CleaningSession.MIN_X, y: 0 }, commands: [
          { steps: 1, direction: Direction.west },
          { steps: 1, direction: Direction.west },
        ],
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });

    it('should track all unique visits MAX_COMMANDS * MAX_STEPS', () => {
      const farthestSouthWest = { x: CleaningSession.MIN_X, y: CleaningSession.MIN_Y };
      const maxCommands: CleaningCommand[] = [];
      for (let i = 0; i < CleaningSession.MAX_COMMANDS; i++) {
        maxCommands.push(
          { steps: CleaningSession.MAX_STEPS, direction: Direction.north },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.north },
          { steps: 1, direction: Direction.east },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.south },
          { steps: CleaningSession.MAX_STEPS, direction: Direction.south },
          { steps: 1, direction: Direction.east },
        );
      }
      const actualExecution = CleaningSession.execute({
        start: farthestSouthWest, commands: maxCommands,
      });
      assertExecution(actualExecution, {
        'commands': 2,
        'uniqueVisits': 1,
      });
    });
  });
});
