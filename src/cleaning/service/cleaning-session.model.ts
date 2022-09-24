import {
  CleanOfficeInput,
  Command,
  Direction,
  Position,
} from '../clean-office.dto';
import { CleanExecution } from '../clean-execution.entity';
import { PerformanceHelper } from './performance.helper';

class CleaningRobot {
  constructor(private position: Position) {}
  move(command: Command): Position[] {
    const visits: Position[] = [this.position];
    for (let i = 0; i < command.steps; i++) {
      this.moveOneStep(command.direction);
      visits.push(this.position);
    }
    return visits;
  }

  private moveOneStep(direction: Direction): void {
    switch (direction) {
      case Direction.east:
        return this.moveOneStepEast();
      case Direction.west:
        return this.moveOneStepWest();
      case Direction.north:
        return this.moveOneStepNorth();
      case Direction.south:
        return this.moveOneStepSouth();
      default:
        throw new Error(`Direction ${direction} is not supported`);
    }
  }

  private moveOneStepEast(): void {
    this.position = Position.from({
      x: this.position.x + 1,
      y: this.position.y,
    });
  }

  private moveOneStepWest(): void {
    this.position = Position.from({
      x: this.position.x - 1,
      y: this.position.y,
    });
  }

  private moveOneStepNorth(): void {
    this.position = Position.from({
      x: this.position.x,
      y: this.position.y + 1,
    });
  }

  private moveOneStepSouth(): void {
    this.position = Position.from({
      x: this.position.x,
      y: this.position.y - 1,
    });
  }
}

type PositionHash = string;
export class CleaningSession {
  private readonly uniquePositions = new Map<PositionHash, Position>();
  private track(positions: Position[]): void {
    positions.forEach((position) =>
      this.uniquePositions.set(this.hashPosition(position), position),
    );
  }

  private hashPosition({ x, y }: Position): PositionHash {
    return `${x}:${y}`;
  }

  performCleaning(
    input: CleanOfficeInput,
  ): Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'> {
    const [uniqueVisits, duration] = PerformanceHelper.measureDuration(() => {
      const cleaningRobot = new CleaningRobot(input.start);
      for (const command of input.commands) {
        const visits = cleaningRobot.move(command);
        this.track(visits);
      }
      return this.uniquePositions.size;
    });
    return { commands: input.commands.length, uniqueVisits, duration };
  }
}
