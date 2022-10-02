import { CleaningInput, Command, Direction, Position } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { PerformanceHelper } from 'src/cleaning/service/performance.helper';

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
    this.position = {
      x: this.position.x + 1,
      y: this.position.y,
    };
  }

  private moveOneStepWest(): void {
    this.position = {
      x: this.position.x - 1,
      y: this.position.y,
    };
  }

  private moveOneStepNorth(): void {
    this.position = {
      x: this.position.x,
      y: this.position.y + 1,
    };
  }

  private moveOneStepSouth(): void {
    this.position = {
      x: this.position.x,
      y: this.position.y - 1,
    };
  }
}

class VisitTracker {
  private readonly uniquePositions = new Map<PositionHash, Position>();
  track(positions: Position[]): void {
    positions.forEach((position) => this.uniquePositions.set(this.hashPosition(position), position));
  }

  countUniqueVisits(): number {
    return this.uniquePositions.size;
  }
  private hashPosition({ x, y }: Position): PositionHash {
    return `${x}:${y}`;
  }
}

type PositionHash = string;
export class CleaningSession {
  static execute(input: CleaningInput): Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'> {
    const [uniqueVisits, duration] = PerformanceHelper.measureDuration(() => {
      const cleaningRobot = new CleaningRobot(input.start);
      const visitTracker = new VisitTracker()
      for (const command of input.commands) {
        const visits = cleaningRobot.move(command);
        visitTracker.track(visits);
      }
      return visitTracker.countUniqueVisits();
    });
    return { commands: input.commands.length, uniqueVisits, duration };
  }
}
