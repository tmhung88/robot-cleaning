import { CleaningCommand, CleaningInput, Direction, Position } from 'src/cleaning/cleaning-input.dto';
import { CleanExecution } from 'src/cleaning/clean-execution.entity';
import { assertNonNullable } from 'src/helper/assert.helper';
import { PerformanceHelper } from 'src/helper/performance.helper';

export class CleaningSession {
  static readonly MIN_X = -100000;
  static readonly MAX_X = 100000;
  static readonly MIN_Y = -100000;
  static readonly MAX_Y = 100000;
  static readonly MAX_STEPS = 100000 - 1;
  static readonly MAX_COMMANDS = 10000;

  static execute(input: CleaningInput): Pick<CleanExecution, 'commands' | 'duration' | 'uniqueVisits'> {
    const [uniqueVisits, duration] = PerformanceHelper.measureDuration(() => {
      const cleaningRobot = new CleaningRobot(input.start);
      const visitTracker = new VisitTracker();
      visitTracker.trackPositions([input.start]);
      input.commands.forEach((command) => {
        const visits = cleaningRobot.move(command);
        visitTracker.trackPositions(visits);
      });

      return visitTracker.countUniqueVisits();
    });
    return { commands: input.commands.length, uniqueVisits, duration };
  }
}

/**
 * Handle moving in a grid.
 * When a robot hits a boundary, then the robot cannot move further
 */
class CleaningRobot {
  constructor(private position: Position) {}

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

type PositionHash = string;
class Partition {
  /**
   * A partition's capacity should be small so that the partition can be quickly full
   * and its memory is released.
   *
   * However, the capacity must not be too small because a large grid can end up
   * with an excessive number of partitions. The max partitions are 2^24 which is
   * the default number of keys a JS Map can hold.
   */
  public static PARTITION_SIDE = 64;

  private static MAX_VISIT_CAPACITY = Partition.PARTITION_SIDE * Partition.PARTITION_SIDE;

  /**
   * trackedPositions is null when the partition is full
   */
  private trackedPositions: Set<PositionHash> | null = new Set<PositionHash>();
  private isFull = false;

  track(position: Position): void {
    if (this.isFull) {
      return;
    }
    assertNonNullable(this.trackedPositions, 'trackedPositions must not be null when bucket is not full');
    this.trackedPositions.add(this.hashPosition(position));
    if (this.trackedPositions.size === Partition.MAX_VISIT_CAPACITY) {
      this.isFull = true;
      this.trackedPositions = null;
    }
  }

  countUniqueVisits(): number {
    if (this.isFull) {
      return Partition.MAX_VISIT_CAPACITY;
    }

    assertNonNullable(this.trackedPositions, 'trackedPositions must not be null when bucket is not full');
    return this.trackedPositions.size;
  }

  private hashPosition({ x, y }: Position): PositionHash {
    return `${x % Partition.PARTITION_SIDE}:${y % Partition.PARTITION_SIDE}`;
  }
}

type PartitionHash = string;

/**
 * Track unique visits of a cleaning session.
 *
 * To avoid out of memory, a grid is split into square partitions.
 * When all positions inside a partition are visited, the partition is considered as "full",
 * and the memory of tracked visits are released.
 */
class VisitTracker {
  private partitionMap = new Map<PartitionHash, Partition>();

  trackPositions(positions: Position[]): void {
    positions.forEach((position) => this.trackPosition(position));
  }

  countUniqueVisits(): number {
    return Array.from(this.partitionMap.values()).reduce(
      (prevCount, currentPartition) => prevCount + currentPartition.countUniqueVisits(),
      0,
    );
  }

  private trackPosition(position: Position): void {
    const partition = this.resolvePartition(position);
    partition.track(position);
  }

  private resolvePartition(position: Position): Partition {
    const partitionHash = `${Math.floor(position.x / Partition.PARTITION_SIDE)}:${Math.floor(
      position.y / Partition.PARTITION_SIDE,
    )}`;
    const partition = this.partitionMap.get(partitionHash);
    if (partition != null) {
      return partition;
    }
    const newBucket = new Partition();
    this.partitionMap.set(partitionHash, newBucket);
    return newBucket;
  }
}
