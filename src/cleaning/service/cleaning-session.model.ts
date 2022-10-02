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

class Bucket {
  public static BUCKET_SIDE = 64;
  private static MAX_CAPACITY = Bucket.BUCKET_SIDE * Bucket.BUCKET_SIDE;
  private trackedPositions = new Set<PositionHash>();
  private isFull = false;

  track(position: Position): void {
    if (this.isFull) {
      return;
    }
    this.trackedPositions.add(this.hashPosition(position));
    if (this.trackedPositions.size === Bucket.MAX_CAPACITY) {
      this.isFull = true;
      this.trackedPositions = null;
    }
  }

  countUniqueVisits(): number {
    if (this.isFull) {
      return Bucket.MAX_CAPACITY;
    }
    return this.trackedPositions.size;
  }

  private hashPosition({ x, y }: Position): PositionHash {
    return `${x % Bucket.BUCKET_SIDE}:${y % Bucket.BUCKET_SIDE}`;
  }
}

class VisitTracker {
  private bucketMap = new Map<string, Bucket>();

  trackPositions(positions: Position[]): void {
    positions.forEach((position) => this.trackPosition(position));
  }

  countUniqueVisits(): number {
    return Array.from(this.bucketMap.values()).reduce((prevCount, currentPartition) => prevCount + currentPartition.countUniqueVisits(), 0);
  }

  private trackPosition(position: Position): void {
    const bucket = this.getBucket(position);
    bucket.track(position);
  }

  private getBucket(position: Position): Bucket {
    const bucketHash = `${Math.floor(position.x / Bucket.BUCKET_SIDE)}:${Math.floor(position.y / Bucket.BUCKET_SIDE)}`;
    if (!this.bucketMap.has(bucketHash)) {
      this.bucketMap.set(bucketHash, new Bucket());
    }
    return this.bucketMap.get(bucketHash);
  }
}

type PositionHash = string;

export class CleaningSession {
  static readonly MIN_X = -100000;
  static readonly MAX_X = 100000;
  static readonly MIN_Y = -100000;
  static readonly MAX_Y = 100000;
  static readonly MAX_STEPS = 100000;
  static readonly MAX_COMMANDS = 10000;

  static execute(input: CleaningInput): Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'> {
    const [uniqueVisits, duration] = PerformanceHelper.measureDuration(() => {
      const cleaningRobot = new CleaningRobot(input.start);
      const visitTracker = new VisitTracker();
      visitTracker.trackPositions([input.start]);
      input.commands.forEach((command, index) => {
        if (index % 100 === 0) {
          console.log(`command ${index}`);
        }
        const visits = cleaningRobot.move(command);
        visitTracker.trackPositions(visits);
      });

      return visitTracker.countUniqueVisits();
    });
    return { commands: input.commands.length, uniqueVisits, duration };
  }
}
