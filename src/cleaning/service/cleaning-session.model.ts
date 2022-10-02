import { CleaningInput, CleaningCommand, Direction, Position } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { PerformanceHelper } from 'src/cleaning/service/performance.helper';

class CleaningRobot {
  constructor(private position: Position) {
  }

  move(command: CleaningCommand): Position[] {
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
      x: Math.min(this.position.x + 1, CleaningSession.MAX_X),
      y: this.position.y,
    };
  }

  private moveOneStepWest(): void {
    this.position = {
      x: Math.max(this.position.x - 1, CleaningSession.MIN_X),
      y: this.position.y,
    };
  }

  private moveOneStepNorth(): void {
    this.position = {
      x: this.position.x,
      y: Math.min(this.position.y + 1, CleaningSession.MAX_Y),
    };
  }

  private moveOneStepSouth(): void {
    this.position = {
      x: this.position.x,
      y: Math.max(this.position.y - 1, CleaningSession.MIN_Y),
    };
  }
}

class VisitTracker {
  private partitionMap = new Map<string, Map<PositionHash, Position>>();

  trackPositions(positions: Position[]): void {
    positions.forEach((position) => this.trackPosition(position));
  }

  countUniqueVisits(): number {
    return Array.from(this.partitionMap.values()).reduce((prevCount, currentPartition) => prevCount + currentPartition.size, 0);
  }

  private trackPosition(position: Position): void {
    const partition = this.getPartition(position);
    partition.set(this.hashPosition(position), position);
  }

  private getPartition(position: Position): Map<PositionHash, Position> {
    const partitionHash = `${Math.floor(position.x / 4096)}:${Math.floor(position.y / 4096)}`
    if (!this.partitionMap.has(partitionHash)) {
      this.partitionMap.set(partitionHash, new Map());
    }
    return this.partitionMap.get(partitionHash);
  }


  private hashPosition({ x, y }: Position): PositionHash {
    return `${Math.abs(x) % 4096}:${Math.abs(y) % 4096}`;
  }
}

type PositionHash = string;

export class CleaningSession {
  static readonly MIN_X = -100000;
  static readonly MAX_X = 100000;
  static readonly MIN_Y = -100000;
  static readonly MAX_Y = 100000;
  static readonly MAX_STEPS = 99999;
  static readonly MAX_COMMANDS = 10000;

  static execute(input: CleaningInput): Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'> {
    const [uniqueVisits, duration] = PerformanceHelper.measureDuration(() => {
      const cleaningRobot = new CleaningRobot(input.start);
      const visitTracker = new VisitTracker();
      visitTracker.trackPositions([input.start]);
      for (const command of input.commands) {
        const visits = cleaningRobot.move(command);
        visitTracker.trackPositions(visits);
      }
      return visitTracker.countUniqueVisits();
    });
    return { commands: input.commands.length, uniqueVisits, duration };
  }
}
