import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Position {
  @IsInt()
  @Min(-100000)
  @Max(100000)
  x: number;

  @IsInt()
  @Min(-100000)
  @Max(100000)
  y: number;

  static from({ x, y }: { x: number; y: number }): Position {
    const position = new Position();
    position.x = x;
    position.y = y;
    return position;
  }
}

export enum Direction {
  east = 'east',
  north = 'north',
  west = 'west',
  south = 'south',
}

export class Command {
  @IsEnum(Direction)
  direction: Direction;

  @IsInt()
  @Min(0)
  @Max(100000)
  steps: number;
}

export class CleanOfficeInput {
  @ValidateNested()
  @Type(() => Position)
  start: Position;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(10000)
  @Type(() => Command)
  commands: Command[];
}
